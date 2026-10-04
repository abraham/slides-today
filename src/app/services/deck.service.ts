import { Injectable, signal } from '@angular/core';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';

type RawDeck = (typeof Data)[number];

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  private readonly decksState = signal<Deck[] | undefined>(undefined);
  private readonly loaded = this.fetchDecks();

  // Undefined until the deck data has loaded.
  readonly decks = this.decksState.asReadonly();

  async get(id: string | null): Promise<Deck | undefined> {
    const decks = await this.loaded;
    return decks.find(deck => deck.id === id);
  }

  filter(tagIds: string[], speakerIds: string[] = []): Deck[] | undefined {
    return this.decks()?.filter(
      deck =>
        tagIds.every(tag => deck.tags.includes(tag)) &&
        speakerIds.every(speaker => deck.speakerIds.includes(speaker)),
    );
  }

  private async fetchDecks(): Promise<Deck[]> {
    const { default: data }: { default: RawDeck[] } =
      await import('../decks.data.json');
    const decks = data
      .filter(deck => !deck.archived)
      .map((deck: RawDeck) => new Deck(deck));
    this.decksState.set(decks);
    return decks;
  }
}
