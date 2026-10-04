import { Injectable, inject, signal } from '@angular/core';
import { EventOccurrence, RawEvent } from '../models/event';
import { EVENTS } from '../repositories';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly eventsState = signal<RawEvent[]>([]);

  readonly loaded = inject(EVENTS)
    .list()
    .then(events => {
      this.eventsState.set(events);
    });

  title(eventId: string): string | undefined {
    return this.eventsState().find(({ id }) => id === eventId)?.title;
  }

  occurrence(eventId: string, occurrenceId: string): EventOccurrence {
    const event = this.eventsState().find(({ id }) => id === eventId);
    const occurrence = event?.occurrences.find(({ id }) => id === occurrenceId);
    if (!event || !occurrence) {
      throw new Error(`Unknown event occurrence ${eventId}/${occurrenceId}`);
    }
    return new EventOccurrence(event, occurrence);
  }
}
