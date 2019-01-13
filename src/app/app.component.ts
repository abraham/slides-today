import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutedComponents } from './app-routing.module';
import { Theme } from './color';
import { DataService } from './data.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private dataService: DataService) {
    this.dataService.theme$.subscribe(this.setThemeColor.bind(this));
  }

  defaultTitle = 'Slides.today';
  title = this.defaultTitle;
  fixed = true;

  @ViewChild('headerEl') headerEl!: HeaderComponent;

  onActivate(event: RoutedComponents): void {
    if ('title' in event) {
      this.title = event.title;
    } else {
      this.title = this.defaultTitle;
    }
  }

  private setThemeColor(theme: Theme) {
    this.themeEl.setAttribute('content', theme.backgroundColor);
  }

  private get themeEl() {
    return document.querySelector('meta[name="theme-color"]');
  }
}
