import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { Link } from '../models/link';
import { DEFAULT_THEME } from '../models/theme';

@Component({
  selector: 'app-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
  imports: [NgStyle, NgTemplateOutlet, RouterLink, MatButton, MatRippleModule],
})
export class CardComponent {
  readonly actions = input<Link[]>([]);
  readonly image = input('');
  readonly theme = input(DEFAULT_THEME);
  readonly url = input('');

  readonly external = computed(() => /^https?:\/\//.test(this.url()));
}
