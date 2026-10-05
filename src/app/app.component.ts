import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import {
  Data,
  NavigationEnd,
  RouteConfigLoadEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { ThemeService } from './services/theme.service';
import { HeaderComponent } from './header/header.component';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  imports: [HeaderComponent, MatCard, NgxSkeletonLoaderComponent, RouterOutlet],
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly injector = inject(Injector);
  private announcedTitle = this.document.title;

  defaultTitle = 'Slides.today';
  readonly skeletonRows = [0, 1, 2, 3, 4];
  readonly showBack = signal(false);
  readonly title = signal(this.defaultTitle);
  readonly styles = this.themeService.tokens;
  // Server-rendered pages already have content, so a skeleton would only cover it until the first route loads.
  readonly firstLoad = signal(
    !isPlatformServer(inject(PLATFORM_ID)) &&
      !inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.hasAttribute(
        'ng-server-context',
      ),
  );

  constructor() {
    this.removeNoScripts();
    const subscription = this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadEnd) {
        this.firstLoad.set(false);
      } else if (event instanceof NavigationEnd) {
        this.announceTitle();
      }
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  onActivate(data: Data): void {
    this.title.set(data['headerTitle'] ?? this.defaultTitle);
    this.showBack.set(data['showBack'] ?? false);
  }

  skipToMain(event: Event): void {
    // The link needs a real href, but following it would navigate to the base url.
    event.preventDefault();
    const main = this.document.querySelector('main');
    if (main) {
      main.tabIndex = -1;
      main.focus();
    }
  }

  // Pages set their title while rendering, and filter-only navigations keep the same title.
  private announceTitle(): void {
    afterNextRender(
      () => {
        const title = this.document.title;
        if (title !== this.announcedTitle) {
          this.announcedTitle = title;
          void this.liveAnnouncer.announce(title);
        }
      },
      { injector: this.injector },
    );
  }

  private removeNoScripts(): void {
    // Array.from because the server DOM's NodeList has no forEach.
    Array.from(this.document.querySelectorAll('noscript')).forEach(element => {
      element.remove();
    });
  }
}
