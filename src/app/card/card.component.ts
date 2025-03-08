import { Component, Input, OnInit } from '@angular/core';
import { Link } from '../models/link';
import { DEFAULT_THEME } from '../models/theme';
import { NgIf, NgStyle, NgTemplateOutlet, NgFor } from '@angular/common';
import { RippleDirective } from '../ripple.directive';
import { RouterLink } from '@angular/router';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
  imports: [
    NgIf,
    NgStyle,
    RippleDirective,
    NgTemplateOutlet,
    RouterLink,
    NgFor,
    MatAnchor,
  ],
})
export class CardComponent implements OnInit {
  @Input() actions: Link[] = [];
  @Input() image = '';
  @Input() theme = DEFAULT_THEME;
  @Input() url = '';

  external = false;

  ngOnInit(): void {
    this.external =
      this.url.startsWith('http://') || this.url.startsWith('https://');
  }
}
