import Data from '../decks.data.json';
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
const range = (start: string, end: string) => ({
  date: { start: `${start}T00:00:00.000Z`, end: `${end}T00:00:00.000Z` },
});

describe('Deck', () => {
  it('copies the fields of the raw deck', () => {
    const data = Data[0]!;
    const deck = new Deck(data);

    expect(deck.id).toBe(data.id);
    expect(deck.title).toBe(data.title);
    expect(deck.eventTitle).toBe(data.eventTitle);
    expect(deck.speakerIds).toEqual(data.speakerIds);
    expect(deck.tweetIds).toEqual(data.tweetIds);
  });

  describe('date', () => {
    it('shows a single day', () => {
      const deck = new Deck(raw(range('2021-10-05', '2021-10-05')));

      expect(deck.date).toBe('Oct 5, 2021');
    });

    it('shows the first day of a multi day event in one month', () => {
      const deck = new Deck(raw(range('2019-06-05', '2019-06-07')));

      expect(deck.date).toBe('Jun 5, 2019');
    });

    it('shows both months of an event that spans two months', () => {
      const deck = new Deck(raw(range('2018-10-31', '2018-11-02')));

      expect(deck.date).toBe('Oct 31-Nov 2, 2018');
    });

    describe('in any time zone', () => {
      const dates = (): [string, string][] =>
        Data.map(deck => [deck.date.start, deck.date.end]);
      const expected = ({ start, end }: { start: string; end: string }) => {
        const part = (iso: string, options: Intl.DateTimeFormatOptions) =>
          new Date(iso).toLocaleString('en-US', {
            ...options,
            timeZone: 'UTC',
          });
        const [sm, sd, sy] = [
          part(start, { month: 'short' }),
          part(start, { day: 'numeric' }),
          part(start, { year: 'numeric' }),
        ];
        const [em, ed, ey] = [
          part(end, { month: 'short' }),
          part(end, { day: 'numeric' }),
          part(end, { year: 'numeric' }),
        ];
        return sm === em
          ? `${sm} ${sd}, ${sy}`
          : `${sm} ${sd}-${em} ${ed}, ${ey}`;
      };

      afterEach(() => vi.unstubAllEnvs());

      it.each(['UTC', 'America/Los_Angeles', 'Pacific/Auckland'])(
        'matches the UTC calendar date in %s',
        zone => {
          vi.stubEnv('TZ', zone);

          const mismatches = dates()
            .map(([start, end]) => ({ start, end }))
            .filter(date => new Deck(raw({ date })).date !== expected(date));

          expect(mismatches).toEqual([]);
        },
      );
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
