import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deck } from './deck';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  decks$ = new ReplaySubject<Deck[]>();

  constructor() {
    this.fetchDecks();
  }

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

  private async fetchDecks(): Promise<void> {
    const { default: data }: { default: any[] } = await import('./decks.data.json');
    const decks = data.filter(deck => !deck.archived)
                 .map((deck: Deck) => new Deck(deck));
    this.decks$.next(decks);
  }
}
