import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { RoutedComponents } from './app-routing.module';
import { Theme } from './color';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private dataService: DataService,
              private router: Router,
              private meta: Meta) {
    this.dataService.theme$.subscribe(this.setThemeColor.bind(this));
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
  theme$ = this.dataService.theme$;
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

  private setThemeColor(theme: Theme) {
    this.meta.updateTag({ name: 'theme-color', content: theme.backgroundColor });
  }

  private updatePath(tagIds: string[]) {
    if (tagIds.length === 0) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', { tags: tagIds }]);
    }
  }
}
