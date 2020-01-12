import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Deck } from '../models/deck';

@Component({
  selector: 'app-deck-summary',
  styleUrls: ['./deck-summary.component.scss'],
  templateUrl: './deck-summary.component.html',
})

export class DeckSummaryComponent implements OnInit {
  constructor(private router: Router) {}

  @Input() deck!: Deck;
  @ViewChild('cardEl', { static: true }) cardEl!: ElementRef;

  url?: string;

  ngOnInit() {
    this.url = this.router.createUrlTree(['/decks', this.deck.id]).toString();
  }

  goToDeck(): void {
    this.router.navigate([this.url]);
  }
}
