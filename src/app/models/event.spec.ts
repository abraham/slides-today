import events from '../events.data.json';
import { EventOccurrence, findOccurrence, RawEvent } from './event';

const occurrence = (start: string, end: string): EventOccurrence => {
  const [event] = events as RawEvent[];
  return new EventOccurrence(event!, {
    ...event!.occurrences[0]!,
    date: { start: `${start}T00:00:00.000Z`, end: `${end}T00:00:00.000Z` },
  });
};

describe('EventOccurrence', () => {
  it('copies the details of the event and the occurrence', () => {
    const event = events[0]!;
    const data = event.occurrences[0]!;
    const result = findOccurrence(event.id, data.id);

    expect(result.id).toBe(data.id);
    expect(result.eventId).toBe(event.id);
    expect(result.eventTitle).toBe(event.title);
    expect(result.location).toBe(data.location);
    expect(result.links).toEqual(data.links);
  });

  describe('findOccurrence', () => {
    it('finds each occurrence of an event that happens multiple times', () => {
      const event = events.find(({ occurrences }) => occurrences.length > 1)!;

      const found = event.occurrences.map(
        ({ id }) => findOccurrence(event.id, id).id,
      );

      expect(found).toEqual(event.occurrences.map(({ id }) => id));
    });

    it('throws for an unknown event or occurrence', () => {
      const event = events[0]!;

      expect(() => findOccurrence('unknown', 'unknown')).toThrow(
        'Unknown event occurrence',
      );
      expect(() => findOccurrence(event.id, 'unknown')).toThrow(
        'Unknown event occurrence',
      );
    });
  });

  describe('date', () => {
    it('shows a single day', () => {
      expect(occurrence('2021-10-05', '2021-10-05').date).toBe('Oct 5, 2021');
    });

    it('shows the first day of a multi day event in one month', () => {
      expect(occurrence('2019-06-05', '2019-06-07').date).toBe('Jun 5, 2019');
    });

    it('shows both months of an event that spans two months', () => {
      expect(occurrence('2018-10-31', '2018-11-02').date).toBe(
        'Oct 31-Nov 2, 2018',
      );
    });

    it('shows both months when the day of the month is the same', () => {
      expect(occurrence('2019-10-05', '2019-11-05').date).toBe(
        'Oct 5-Nov 5, 2019',
      );
    });

    it('shows both years of an event that spans two years', () => {
      expect(occurrence('2018-12-30', '2019-01-02').date).toBe(
        'Dec 30, 2018-Jan 2, 2019',
      );
    });

    it('shows both years when only the month name repeats', () => {
      expect(occurrence('2018-12-30', '2019-12-02').date).toBe(
        'Dec 30, 2018-Dec 2, 2019',
      );
    });

    describe('in any time zone', () => {
      const dates = (): [string, string][] => [
        ...events.flatMap(event =>
          event.occurrences.map((data): [string, string] => [
            data.date.start,
            data.date.end,
          ]),
        ),
        ['2018-12-30T00:00:00.000Z', '2019-01-01T00:00:00.000Z'],
        ['2019-01-01T00:00:00.000Z', '2019-01-02T00:00:00.000Z'],
      ];
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
        return sy !== ey
          ? `${sm} ${sd}, ${sy}-${em} ${ed}, ${ey}`
          : sm === em
            ? `${sm} ${sd}, ${sy}`
            : `${sm} ${sd}-${em} ${ed}, ${ey}`;
      };

      afterEach(() => vi.unstubAllEnvs());

      it.each(['UTC', 'America/Los_Angeles', 'Pacific/Auckland'])(
        'matches the UTC calendar date in %s',
        zone => {
          vi.stubEnv('TZ', zone);
          const [event] = events as RawEvent[];

          const mismatches = dates()
            .map(([start, end]) => ({ start, end }))
            .filter(
              date =>
                new EventOccurrence(event!, {
                  ...event!.occurrences[0]!,
                  date,
                }).date !== expected(date),
            );

          expect(mismatches).toEqual([]);
        },
      );
    });
  });
});
