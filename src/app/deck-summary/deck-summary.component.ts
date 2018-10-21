import { Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Deck } from '../deck';

@Component({
  selector: 'app-deck-summary',
  templateUrl: './deck-summary.component.html',
  styleUrls: ['./deck-summary.component.scss'],
})

export class DeckSummaryComponent implements OnInit, OnChanges {
  constructor (private router: Router) {}

  @ViewChild('cardEl') cardEl!: ElementRef;

  @Input() deck?: Deck;
  @Input() currentTags: string[] = [];
  @HostBinding('style.display') display = 'inline';

  of = of;
  url?: string;

  ngOnInit() {
    this.setUrl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentTags) {
      this.setDisplay();
    }
  }

  setUrl(): void {
    if (!this.deck) { return; }
    this.url = this.router.createUrlTree(['/decks', this.deck.id]).toString();
  }

  goToDeck(): void {
    this.router.navigate([this.url]);
  }

  private hidden(): boolean {
    const deckTags = this.deck ? this.deck.tags : [];
    const selectedTags = this.currentTags.length !== 0;
    const selectedTagsOnDeck = !this.currentTags.every(tag => deckTags.includes(tag));
    return selectedTags && selectedTagsOnDeck;
  }

  setDisplay(): void {
    if (this.hidden()) {
      this.display = 'none';
    } else {
      this.display = 'inline';
    }
  }
}
