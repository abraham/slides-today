import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink, Router } from '@angular/router';
import { Link } from '../models/link';
import { DEFAULT_THEME, themeTokens } from '../models/theme';

@Component({
  selector: 'app-card',
  styleUrl: './card.component.scss',
  templateUrl: './card.component.html',
  imports: [
    NgTemplateOutlet,
    RouterLink,
    MatButton,
    MatCard,
    MatCardActions,
    MatRippleModule,
  ],
})
export class CardComponent {
  private readonly router = inject(Router);

  readonly actions = input<Link[]>([]);
  readonly image = input('');
  readonly theme = input(DEFAULT_THEME);
  readonly styles = computed(() => themeTokens(this.theme()));
  readonly url = input('');

  readonly external = computed(() => /^https?:\/\//.test(this.url()));

  // Actions that are not absolute urls stay in the app and keep their query params.
  readonly actionLinks = computed(() =>
    this.actions().map(action => ({
      action,
      route: /^https?:\/\//.test(action.url)
        ? undefined
        : this.router.parseUrl(action.url),
    })),
  );
}
