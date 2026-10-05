import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { loadWhenVisible } from './load-when-visible';

const load = vi.fn(async () => undefined);

@Component({ selector: 'app-widget', template: '' })
class WidgetComponent {
  constructor() {
    loadWhenVisible(load);
  }
}

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  constructor(
    private readonly callback: (entries: { isIntersecting: boolean }[]) => void,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  intersect(isIntersecting: boolean): void {
    this.callback([{ isIntersecting }]);
  }
}

describe('loadWhenVisible', () => {
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(() => {
    load.mockClear();
    FakeIntersectionObserver.instances = [];
  });

  afterEach(() => vi.unstubAllGlobals());

  const render = (): FakeIntersectionObserver => {
    fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();
    return FakeIntersectionObserver.instances[0];
  };

  describe('with IntersectionObserver', () => {
    beforeEach(() =>
      vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver),
    );

    it('waits until the element is near the viewport', () => {
      const observer = render();

      expect(observer.observe).toHaveBeenCalledWith(fixture.nativeElement);
      expect(observer.options?.rootMargin).toBe('200px');
      observer.intersect(false);
      expect(load).not.toHaveBeenCalled();
    });

    it('loads once when the element becomes visible', () => {
      const observer = render();

      observer.intersect(true);

      expect(load).toHaveBeenCalledTimes(1);
      expect(observer.disconnect).toHaveBeenCalled();
    });

    it('stops observing when the component is destroyed', () => {
      const observer = render();

      fixture.destroy();

      expect(observer.disconnect).toHaveBeenCalled();
      expect(load).not.toHaveBeenCalled();
    });
  });

  it('loads right away without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);

    render();

    expect(load).toHaveBeenCalledTimes(1);
  });
});
