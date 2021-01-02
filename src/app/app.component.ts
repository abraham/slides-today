import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoutedComponents } from './modules/app-routing.module';
import { DataService } from './services/data.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  defaultTitle = 'Slides.today';
  showBack = false;
  title = this.defaultTitle;
  theme$ = this.themeService.current$;
  firstLoad = true;

  private destroy$ = new Subject();

  constructor(
    private dataService: DataService,
    private themeService: ThemeService,
    private router: Router,
  ) {
    this.removeNoScripts();
  }

  ngOnInit() {
    this.dataService.path$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.updatePath.bind(this));
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event instanceof RouteConfigLoadEnd) {
        this.firstLoad = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onActivate(event: RoutedComponents): void {
    if ('title' in event) {
      this.title = event.title;
    } else {
      this.title = this.defaultTitle;
    }
    if ('showBack' in event) {
      this.showBack = event.showBack;
    } else {
      this.showBack = false;
    }
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
