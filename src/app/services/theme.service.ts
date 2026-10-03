import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { DEFAULT_THEME, Theme, themeTokens } from '../models/theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly meta = inject(Meta);
  private theme = signal<Theme>(DEFAULT_THEME);

  readonly current = this.theme.asReadonly();
  readonly tokens = computed(() => themeTokens(this.theme()));

  constructor() {
    effect(() => {
      this.meta.updateTag({
        content: this.theme().backgroundColor,
        name: 'theme-color',
      });
    });
  }

  update(theme: Theme): void {
    this.theme.set(theme);
  }

  reset(): void {
    this.theme.set(DEFAULT_THEME);
  }
}
