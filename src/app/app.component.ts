import { Component, Input, ViewChild } from '@angular/core';

import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { HeaderComponent } from './header/header.component';
import { RoutedComponents } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  defaultTitle = 'Slides.today';
  title = this.defaultTitle;
  defaultColors = { color: '#000', backgroundColor: '#FF9800' };
  colors = this.defaultColors;
  fixed = true;

  @ViewChild('headerEl') headerEl!: HeaderComponent;

  onActivate(event: RoutedComponents): void {
    if ('title' in event) {
      this.title = event.title;
    } else {
      this.title = this.defaultTitle;
    }
    if ('onColorsChange' in event) {
      event.onColorsChange.subscribe(this.onColorsChange.bind(this));
    } else {
      this.colors = this.defaultColors;
      this.headerEl.transitionToHome();
    }
  }

  onColorsChange(colors: { color: string, backgroundColor: string }): void {
    this.headerEl.transitionToDetails();
    this.colors = colors;
  }
}
