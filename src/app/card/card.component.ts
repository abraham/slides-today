import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
