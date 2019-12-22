import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_INVERTED_THEME, DEFAULT_THEME, invert, Theme } from './color';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  current$ = new BehaviorSubject<Theme>(DEFAULT_THEME);
  inverted$ = new BehaviorSubject<Theme>(DEFAULT_INVERTED_THEME);

  constructor() {
    this.current$.subscribe(theme => this.inverted$.next(invert(theme)));
  }

  update(theme: Theme) {
    this.current$.next(theme);
  }

  reset() {
    this.current$.next(DEFAULT_THEME);
  }
}
