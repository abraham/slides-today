import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_INVERTED_THEME, DEFAULT_THEME, invert, Theme } from '../models/theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  current$ = new BehaviorSubject<Theme>(DEFAULT_THEME);
  inverted$ = new BehaviorSubject<Theme>(DEFAULT_INVERTED_THEME);

  constructor(private meta: Meta) {
    this.current$.subscribe(theme => {
      this.inverted$.next(invert(theme));
      this.meta.updateTag({ name: 'theme-color', content: theme.backgroundColor });
    });
  }

  update(theme: Theme) {
    this.current$.next(theme);
  }

  reset() {
    this.current$.next(DEFAULT_THEME);
  }
}
