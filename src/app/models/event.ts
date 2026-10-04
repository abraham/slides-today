import Data from '../events.data.json';
import { Link } from './link';

type RawEvent = (typeof Data)[number];
type RawOccurrence = RawEvent['occurrences'][number];

// A single happening of an event, such as one edition of a conference or one meetup.
export class EventOccurrence {
  readonly id: string;
  readonly eventId: string;
  readonly eventTitle: string;
  readonly location: string;
  readonly links: Link[];

  private readonly start: Date;
  private readonly end: Date;

  constructor(event: RawEvent, data: RawOccurrence) {
    this.id = data.id;
    this.eventId = event.id;
    this.eventTitle = event.title;
    this.location = data.location;
    this.links = data.links as Link[];
    this.start = new Date(data.date.start);
    this.end = new Date(data.date.end);
  }

  get date(): string {
    const { start, end } = this;
    const startDay = `${month(start)} ${start.getUTCDate()}`;
    const endDay = `${month(end)} ${end.getUTCDate()}`;
    if (start.getUTCFullYear() !== end.getUTCFullYear()) {
      return `${startDay}, ${start.getUTCFullYear()}-${endDay}, ${end.getUTCFullYear()}`;
    }
    if (start.getUTCMonth() !== end.getUTCMonth()) {
      return `${startDay}-${endDay}, ${end.getUTCFullYear()}`;
    }
    return `${startDay}, ${start.getUTCFullYear()}`;
  }
}

const month = (date: Date): string =>
  date.toLocaleString('en-us', { month: 'short', timeZone: 'UTC' });

export const findOccurrence = (
  eventId: string,
  occurrenceId: string,
): EventOccurrence => {
  const event = Data.find(({ id }) => id === eventId);
  const occurrence = event?.occurrences.find(({ id }) => id === occurrenceId);
  if (!event || !occurrence) {
    throw new Error(`Unknown event occurrence ${eventId}/${occurrenceId}`);
  }
  return new EventOccurrence(event, occurrence);
};
