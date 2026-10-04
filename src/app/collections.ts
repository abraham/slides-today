import type { RawDeck } from './models/deck';

export const COLLECTIONS = {
  decks: 'decks',
  events: 'events',
  speakers: 'speakers',
  sponsors: 'sponsors',
  tags: 'tags',
} as const;

// Archived decks stay in the JSON history but are never written to Firestore.
export const publishedDecks = (decks: RawDeck[]): RawDeck[] =>
  decks.filter(({ archived }) => !archived);

export interface DeckDocument extends RawDeck {
  // Flat copy of `events[].eventId`, since array-contains cannot match part of a map.
  eventIds: string[];
}

export const deckDocument = (deck: RawDeck): DeckDocument => ({
  ...deck,
  eventIds: [...new Set(deck.events.map(({ eventId }) => eventId))],
});
