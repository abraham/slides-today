import { TestBed } from '@angular/core/testing';
import events from '../events.data.json';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    service = TestBed.inject(EventService);
    await service.loaded;
  });

  it('finds the title of an event', () => {
    const [event] = events;

    expect(service.title(event!.id)).toBe(event!.title);
    expect(service.title('unknown')).toBeUndefined();
  });

  describe('occurrence', () => {
    it('copies the details of the event and the occurrence', () => {
      const event = events[0]!;
      const data = event.occurrences[0]!;

      const result = service.occurrence(event.id, data.id);

      expect(result.id).toBe(data.id);
      expect(result.eventId).toBe(event.id);
      expect(result.eventTitle).toBe(event.title);
    });

    it('finds each occurrence of an event that happens multiple times', () => {
      const event = events.find(({ occurrences }) => occurrences.length > 1)!;

      const found = event.occurrences.map(
        ({ id }) => service.occurrence(event.id, id).id,
      );

      expect(found).toEqual(event.occurrences.map(({ id }) => id));
    });

    it('throws for an unknown event or occurrence', () => {
      const event = events[0]!;

      expect(() => service.occurrence('unknown', 'unknown')).toThrow(
        'Unknown event occurrence',
      );
      expect(() => service.occurrence(event.id, 'unknown')).toThrow(
        'Unknown event occurrence',
      );
    });
  });
});
