import { DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

// Widgets further down the page skip their bundle and API calls until the reader gets close.
export const loadWhenVisible = (load: () => Promise<unknown>): void => {
  const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    if (typeof IntersectionObserver === 'undefined') {
      load();
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(({ isIntersecting }) => isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(element);
    destroyRef.onDestroy(() => observer.disconnect());
  });
};
