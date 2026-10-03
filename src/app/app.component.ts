import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouteConfigLoadEnd, Router, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoutedComponents } from './modules/app-routing.module';
import { DataService } from './services/data.service';
import { ThemeService } from './services/theme.service';
import { NgStyle } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  imports: [NgStyle, HeaderComponent, NgxSkeletonLoaderComponent, RouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  defaultTitle = 'Slides.today';
  readonly showBack = signal(false);
  readonly title = signal(this.defaultTitle);
  readonly theme = this.themeService.current;
  readonly firstLoad = signal(true);

  private destroy$ = new Subject();

  constructor() {
    this.removeNoScripts();
  }

  ngOnInit() {
    this.dataService.path$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updatePath.bind(this));
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof RouteConfigLoadEnd) {
        this.firstLoad.set(false);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
