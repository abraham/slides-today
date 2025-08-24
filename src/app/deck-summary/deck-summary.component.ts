import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Deck } from '../models/deck';
import { CardComponent } from '../card/card.component';
import { AsyncPipe } from '@angular/common';
import { TagListPipe } from '../tag-list.pipe';

@Component({
  selector: 'app-deck-summary',
  styleUrls: ['./deck-summary.component.scss'],
  templateUrl: './deck-summary.component.html',
  imports: [CardComponent, AsyncPipe, TagListPipe],
})
export class DeckSummaryComponent implements OnInit {
  @Input() deck!: Deck;
  @ViewChild('cardEl', { static: true }) cardEl!: ElementRef;

  url = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.url = this.router.createUrlTree(['/decks', this.deck.id]).toString();
  }
}
