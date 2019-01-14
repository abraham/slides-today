import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutedComponents } from './app-routing.module';
import { Theme } from './color';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: DataService,
              private router: Router) {
    this.dataService.theme$.subscribe(this.setThemeColor.bind(this));
    this.dataService.path$.subscribe(this.updatePath.bind(this));
  }

  defaultTitle = 'Slides.today';
  showBack = true;
  title = this.defaultTitle;

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
    this.themeEl.setAttribute('content', theme.backgroundColor);
  }

  private get themeEl() {
    return document.querySelector('meta[name="theme-color"]');
  }

  private updatePath(tagIds: string[]) {
    if (tagIds.length === 0) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', { tags: tagIds }]);
    }
  }
}
