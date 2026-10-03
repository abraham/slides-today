import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  Data,
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
  imports: [HeaderComponent, NgxSkeletonLoaderComponent, RouterOutlet],
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  defaultTitle = 'Slides.today';
  readonly skeletonRows = [0, 1, 2, 3, 4];
  readonly showBack = signal(false);
  readonly title = signal(this.defaultTitle);
  readonly theme = this.themeService.current;
  readonly firstLoad = signal(true);

  constructor() {
    this.removeNoScripts();
    const subscription = this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadEnd) {
        this.firstLoad.set(false);
      }
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  onActivate(data: Data): void {
    this.title.set(data['headerTitle'] ?? this.defaultTitle);
    this.showBack.set(data['showBack'] ?? false);
  }

  private removeNoScripts(): void {
    this.document.querySelectorAll('noscript').forEach(element => {
      element.remove();
    });
  }
}
