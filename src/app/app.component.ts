import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Data,
  RouteConfigLoadEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
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
  readonly firstLoad = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof RouteConfigLoadEnd),
      map(() => false),
    ),
    { initialValue: true },
  );

  constructor() {
    this.removeNoScripts();
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
