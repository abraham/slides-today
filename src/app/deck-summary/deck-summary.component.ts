import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'intl-list-format';
import "intl-list-format/locale-data/en";
import { of } from 'rxjs';
import { rgb, Theme } from '../color';
import { Deck } from '../deck';

@Component({
  selector: 'app-deck-summary',
  templateUrl: './deck-summary.component.html',
  styleUrls: ['./deck-summary.component.scss'],
})

export class DeckSummaryComponent implements OnInit {
  constructor (private router: Router) {}

  @Input() deck!: Deck;
  @Input() currentTags: string[] = [];
  @ViewChild('cardEl', { static: true }) cardEl!: ElementRef;

  tags = '';
  of = of;
  url?: string;
  style: Theme = {
    color: '#000',
    backgroundColor: '#fff',
  };

  ngOnInit() {
    this.setUrl();
    this.tags = this.formatter.format(this.deck.tags.map(tag => `#${tag}`));
    this.style = {
      color: rgb(this.deck.theme.complementaryColor),
      backgroundColor: rgb(this.deck.theme.primaryColor),
    };
  }

  setUrl(): void {
    this.url = this.router.createUrlTree(['/decks', this.deck.id]).toString();
  }

  goToDeck(): void {
    this.router.navigate([this.url]);
  }

  private get formatter() {
    // TODO: Fix any
    return new (Intl as any).ListFormat('en', { style: 'long', type: 'conjunction' });
  }
}
