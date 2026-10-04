import Data from '../decks.data.json';
import events from '../events.data.json';
import tagData from '../tags.data.json';
import { Deck } from './deck';
import { DEFAULT_THEME } from './theme';

type RawDeck = (typeof Data)[number];

const raw = (overrides: Partial<RawDeck> = {}): RawDeck => ({
  ...Data[0]!,
  tags: [],
  links: [],
  resources: [],
  ...overrides,
});

describe('Deck', () => {
  it('copies the fields of the raw deck', () => {
    const data = Data[0]!;
    const deck = new Deck(data);

    expect(deck.id).toBe(data.id);
    expect(deck.legacyId).toBe(data.legacyId);
    expect(deck.title).toBe(data.title);
    expect(deck.speakerIds).toEqual(data.speakerIds);
    expect(deck.tweetIds).toEqual(data.tweetIds);
  });

  describe('events', () => {
    const multiple = Data.find(deck => deck.events.length > 1)!;

    it('takes the event details from its occurrence', () => {
      const data = Data[0]!;
      const [{ eventId, occurrenceId }] = data.events as [
        RawDeck['events'][number],
      ];
      const event = events.find(({ id }) => id === eventId)!;
      const occurrence = event.occurrences.find(
        ({ id }) => id === occurrenceId,
      )!;
      const deck = new Deck(data);

      expect(deck.eventTitle).toBe(event.title);
      expect(deck.location).toBe(occurrence.location);
      expect(deck.date).toBe('Oct 5, 2021');
      expect(
        deck.occurrences.map(({ eventId, id }) => ({
          eventId,
          occurrenceId: id,
        })),
      ).toEqual(data.events);
    });

    it('combines the titles of multiple events', () => {
      const deck = new Deck(multiple);

      expect(deck.eventIds).toEqual(multiple.events.map(e => e.eventId));
      expect(deck.occurrences).toHaveLength(multiple.events.length);
      expect(deck.eventTitle).toBe('GDG Madison & Madison Women in Tech');
    });

    it('keeps the links of the events out of the links of the deck', () => {
      const link = { title: 'Slides', url: 'https://example.com/a' };
      const deck = new Deck(raw({ links: [link] as RawDeck['links'] }));

      expect(deck.links.map(({ title }) => title)).toEqual(['Slides']);
    });

    it('throws for an unknown occurrence', () => {
      const [{ eventId }] = Data[0]!.events;

      expect(
        () => new Deck(raw({ events: [{ eventId, occurrenceId: 'unknown' }] })),
      ).toThrow('Unknown event occurrence');
    });

    it('throws without any occurrence', () => {
      expect(() => new Deck(raw({ events: [] }))).toThrow('no event');
    });
  });

  describe('tags', () => {
    it('keeps the tags of the deck without duplicates', () => {
      const deck = new Deck(raw({ tags: ['angular', 'pwa', 'angular'] }));

      expect(deck.tags).toEqual(['angular', 'pwa']);
    });

    it('adds the lower cased titles of links and resources marked as tags', () => {
      const link = {
        title: 'Slides',
        url: 'https://example.com/a',
        useAsTag: true,
      };
      const skipped = {
        title: 'Video',
        url: 'https://example.com/b',
        useAsTag: false,
      };
      const resource = {
        title: 'CodeLab',
        url: 'https://example.com/c',
        useAsTag: true,
      };
      const deck = new Deck(
        raw({
          tags: ['angular'],
          links: [link, skipped] as RawDeck['links'],
          resources: [resource] as RawDeck['resources'],
        }),
      );

      expect(deck.tags).toEqual(['angular', 'slides', 'codelab']);
    });

    it('recomputes the tags when they are set', () => {
      const deck = new Deck(raw({ tags: ['angular'] }));

      deck.tags = ['pwa'];

      expect(deck.tags).toEqual(['pwa']);
    });
  });

  describe('theme', () => {
    it('uses the colors of the first tag', () => {
      const [tag] = tagData;
      const deck = new Deck(raw({ tags: [tag!.id, 'other'] }));

      expect(deck.theme).toEqual({
        backgroundColor: tag!.primaryColor,
        color: tag!.complementaryColor,
      });
    });

    it('uses the default theme without a known first tag', () => {
      expect(new Deck(raw({ tags: [] })).theme).toEqual(DEFAULT_THEME);
      expect(new Deck(raw({ tags: ['unknown-tag'] })).theme).toEqual(
        DEFAULT_THEME,
      );
    });
  });
});
