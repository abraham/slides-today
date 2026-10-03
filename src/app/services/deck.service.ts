import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';

type RawDeck = (typeof Data)[number];

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  private readonly loaded = this.fetchDecks();

  // Undefined until the deck data has loaded.
  readonly decks = toSignal(from(this.loaded));

  async get(id: string | null): Promise<Deck | undefined> {
    const decks = await this.loaded;
    return decks.find(deck => deck.id === id);
  }

  filter(tagIds: string[]): Deck[] | undefined {
    return this.decks()?.filter(deck =>
      tagIds.every(tag => deck.tags.includes(tag)),
    );
  }

  private async fetchDecks(): Promise<Deck[]> {
    const { default: data }: { default: RawDeck[] } =
      await import('../decks.data.json');
    return data
      .filter(deck => !deck.archived)
      .map((deck: RawDeck) => new Deck(deck));
  }
}
