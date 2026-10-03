import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Deck } from '../models/deck';
import { CardComponent } from '../card/card.component';
import { TagListPipe } from '../tag-list.pipe';

@Component({
  selector: 'app-deck-summary',
  styleUrl: './deck-summary.component.scss',
  templateUrl: './deck-summary.component.html',
  imports: [CardComponent, TagListPipe],
})
export class DeckSummaryComponent {
  private readonly router = inject(Router);

  readonly deck = input.required<Deck>();

  readonly url = computed(() =>
    this.router.createUrlTree(['/decks', this.deck().id]).toString(),
  );
}
