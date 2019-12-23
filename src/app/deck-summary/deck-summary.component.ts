import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Deck } from '../deck';
import { DEFAULT_THEME } from '../theme';

@Component({
  selector: 'app-deck-summary',
  styleUrls: ['./deck-summary.component.scss'],
  templateUrl: './deck-summary.component.html',
})

export class DeckSummaryComponent implements OnInit {
  constructor(private router: Router) {}

  @Input() deck!: Deck;
  @Input() currentTags: string[] = [];
  @ViewChild('cardEl', { static: true }) cardEl!: ElementRef;

  tags = '';
  url?: string;
  style = DEFAULT_THEME;

  ngOnInit() {
    this.setUrl();
    this.style = this.deck.theme;
  }

  setUrl(): void {
    this.url = this.router.createUrlTree(['/decks', this.deck.id]).toString();
  }

  goToDeck(): void {
    this.router.navigate([this.url]);
  }
}
