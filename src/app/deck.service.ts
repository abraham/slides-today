import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deck } from './deck';
import deckData from './decks.data.json';

const DECKS: Deck[] = deckData.filter(deck => !deck.archived)
                              .map((deck: Deck) => new Deck(deck));

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  decks$ = of(DECKS);

  get(id: string): Observable<Deck> {
    return this.decks$.pipe(
      map((decks: Deck[]) => decks.find((deck: Deck) => deck.id === id))
    );
  }

  filter(selectedTagIds$: Observable<string[]>): Observable<Deck[]> {
    return combineLatest(
      this.decks$,
      selectedTagIds$,
      this.filterDecks,
    );
  }

  private filterDecks(decks: Deck[], tags: string[]): Deck[] {
    return decks.filter(deck => {
      return tags.every(tag => {
        return deck.tags.includes(tag);
      });
    });
  }
}
