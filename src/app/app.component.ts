import { Component } from '@angular/core';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { RoutedComponents } from './app-routing.module';
import { DataService } from './services/data.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private dataService: DataService,
              private themeService: ThemeService,
              private router: Router) {
    this.dataService.path$.subscribe(this.updatePath.bind(this));
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadEnd) {
        this.firstLoad = false;
      }
    });
  }

  defaultTitle = 'Slides.today';
  showBack = false;
  title = this.defaultTitle;
  theme$ = this.themeService.current$;
  firstLoad = true;

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

  private updatePath(tags: string[]) {
    if (tags.length === 0) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', { tags }]);
    }
  }
}
