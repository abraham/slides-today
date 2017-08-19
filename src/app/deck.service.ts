import { Injectable } from '@angular/core';
import { Deck } from './deck';
import { DECKS } from './decks.data';

@Injectable()
export class DeckService {
  getDecks(): Promise<Deck[]> {
    return Promise.resolve(DECKS);
  }

  getDeckById(id: number): Promise<Deck> {
    return Promise.resolve(DECKS.find(deck => deck.id === id));
  }
}
