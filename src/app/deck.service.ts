import { Injectable } from '@angular/core';
import { Deck } from './deck';
import DECKS from './decks.data.json';
import { Link } from './link';

// Get an ID with firebase.database().ref('test').push().key

export const decks: Deck[] = DECKS.map(deck => {
  deck.links = deck.links.map(link => new Link(link));
  return new Deck(deck);
});

@Injectable()
export class DeckService {
  getDecks(): Promise<Deck[]> {
    return Promise.resolve(decks);
  }

  getDeck(id: string): Promise<Deck> {
    return Promise.resolve(decks.find(deck => deck.id === id));
  }
}
