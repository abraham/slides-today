import { Component, Input, OnInit } from '@angular/core';
import { Link } from '../models/link';
import { DEFAULT_THEME } from '../models/theme';

@Component({
  selector: 'app-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {

  @Input() actions: Link[] = [];
  @Input() image = '';
  @Input() theme = DEFAULT_THEME;
  @Input() url = '';

  external = false;

  constructor() { }

  ngOnInit(): void {
    this.external = this.url.startsWith('http://') || this.url.startsWith('https://');
  }

}
