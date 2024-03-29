import { Injectable } from '@angular/core';
import { combineLatest, EMPTY, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';

type RawDeck = (typeof Data)[number];

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  decks$ = new ReplaySubject<Deck[]>();

  constructor() {
    this.fetchDecks();
  }

  get(id: string | null): Observable<Deck | undefined> {
    if (!id) {
      return EMPTY;
    }
    return this.decks$.pipe(
      map((decks: Deck[]) => decks.find((deck: Deck) => deck.id === id)),
    );
  }

  filter(selectedTagIds$: Observable<string[]>): Observable<Deck[]> {
    return combineLatest(this.decks$, selectedTagIds$, this.filterDecks);
  }

  private filterDecks(decks: Deck[], tags: string[]): Deck[] {
    return decks.filter(deck => tags.every(tag => deck.tags.includes(tag)));
  }

  private async fetchDecks(): Promise<void> {
    const { default: data }: { default: RawDeck[] } = await import(
      '../decks.data.json'
    );
    const decks = data
      .filter(deck => !deck.archived)
      .map((deck: RawDeck) => new Deck(deck));
    this.decks$.next(decks);
  }
}
