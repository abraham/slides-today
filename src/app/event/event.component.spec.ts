import { ComponentFixture, TestBed } from '@angular/core/testing';
import events from '../events.data.json';
import { findOccurrence } from '../models/event';
import { EventComponent } from './event.component';

describe('EventComponent', () => {
  let fixture: ComponentFixture<EventComponent>;

  const show = (eventId: string, occurrenceId: string) => {
    fixture.componentRef.setInput(
      'occurrence',
      findOccurrence(eventId, occurrenceId),
    );
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(EventComponent);
  });

  it('shows the title, date and location of the event', () => {
    const [event] = events;
    const [occurrence] = event!.occurrences;
    show(event!.id, occurrence!.id);

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain(event!.title);
    expect(text).toContain('Oct 5, 2021');
    expect(text).toContain(occurrence!.location);
  });

  it('links to the pages of the event in new tabs', () => {
    const event = events.find(({ occurrences }) =>
      occurrences.some(({ links }) => links.length > 0),
    )!;
    const occurrence = event.occurrences.find(({ links }) => links.length > 0)!;
    show(event.id, occurrence.id);

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('mat-card-actions a'),
    );
    expect(links.map(link => link.getAttribute('href'))).toEqual(
      occurrence.links.map(link => link.url),
    );
  });

  it('has no links for an event without any', () => {
    const event = events.find(({ occurrences }) =>
      occurrences.some(({ links }) => links.length === 0),
    )!;
    const occurrence = event.occurrences.find(
      ({ links }) => links.length === 0,
    )!;
    show(event.id, occurrence.id);

    expect(fixture.nativeElement.querySelector('mat-card-actions')).toBeNull();
  });
});
