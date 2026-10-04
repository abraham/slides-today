import decks from './decks.data.json';
import events from './events.data.json';
import tags from './tags.data.json';
import { Deck, RawDeck } from './models/deck';
import { EventOccurrence, RawEvent } from './models/event';
import { Tag } from './models/tag';

export const createOccurrence = (
  eventId: string,
  occurrenceId: string,
): EventOccurrence => {
  const event = (events as RawEvent[]).find(({ id }) => id === eventId)!;
  const occurrence = event.occurrences.find(({ id }) => id === occurrenceId)!;
  return new EventOccurrence(event, occurrence);
};

export const createDeck = (raw: RawDeck = decks[0]!): Deck =>
  new Deck(
    raw,
    raw.events.map(({ eventId, occurrenceId }) =>
      createOccurrence(eventId, occurrenceId),
    ),
    tags as Tag[],
  );
