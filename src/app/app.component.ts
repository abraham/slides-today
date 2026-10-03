import { Component, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouteConfigLoadEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { RoutedComponents } from './app.routes';
import { DataService } from './services/data.service';
import { ThemeService } from './services/theme.service';
import { HeaderComponent } from './header/header.component';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  imports: [HeaderComponent, NgxSkeletonLoaderComponent, RouterOutlet],
})
export class AppComponent {
  private dataService = inject(DataService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  defaultTitle = 'Slides.today';
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
    effect(() => {
      const path = this.dataService.path();
      if (path) {
        untracked(() => this.updatePath(path));
      }
    });
  }

  onActivate(event: RoutedComponents): void {
    this.title.set('title' in event ? event.title : this.defaultTitle);
    this.showBack.set('showBack' in event ? event.showBack : false);
  }

  private updatePath(tags: string[]): void {
    if (tags.length === 0) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', { tags }]);
    }
  }

  private removeNoScripts(): void {
    document.querySelectorAll('noscript').forEach(element => {
      element.remove();
    });
  }
}
