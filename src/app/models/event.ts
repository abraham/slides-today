import { Link, RawLink } from './link';

export interface RawOccurrence {
  id: string;
  date: { start: string; end: string };
  location: string;
  links: RawLink[];
}

export interface RawEvent {
  id: string;
  title: string;
  occurrences: RawOccurrence[];
}

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
