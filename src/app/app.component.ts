import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoutedComponents } from './modules/app-routing.module';
import { DataService } from './services/data.service';
import { ThemeService } from './services/theme.service';
import { ServiceWorkerModule } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  imports: [NgFor, AsyncPipe, NgIf, NgStyle, ServiceWorkerModule],
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onActivate(e: unknown): void {
    // TODO: Find a better way to do this
    const event = e as RoutedComponents;
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
