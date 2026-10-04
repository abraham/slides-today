import decks from './decks.data.json';
import { deckDocument, publishedDecks } from './collections';
import type { RawDeck } from './models/deck';

describe('deckDocument', () => {
  it('adds the unique event ids of the deck', () => {
    const deck = {
      ...(decks[0] as RawDeck),
      events: [
        { eventId: 'a', occurrenceId: '1' },
        { eventId: 'a', occurrenceId: '2' },
        { eventId: 'b', occurrenceId: '3' },
      ],
    };

    expect(deckDocument(deck).eventIds).toEqual(['a', 'b']);
  });

  it('keeps the other fields of the deck', () => {
    const deck = decks[0] as RawDeck;

    expect(deckDocument(deck)).toMatchObject(deck);
  });
});

describe('publishedDecks', () => {
  it('skips archived decks', () => {
    const all = decks as RawDeck[];

    const published = publishedDecks(all);

    expect(all.some(deck => deck.archived)).toBe(true);
    expect(published.length).toBeGreaterThan(0);
    expect(published.some(deck => deck.archived)).toBe(false);
    expect(published.length).toBe(all.filter(deck => !deck.archived).length);
  });
});
