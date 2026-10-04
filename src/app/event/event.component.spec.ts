import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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
      providers: [provideRouter([])],
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

  const hrefs = (): (string | null)[] =>
    Array.from<HTMLAnchorElement>(
      fixture.nativeElement.querySelectorAll('mat-card-actions a'),
    ).map(link => link.getAttribute('href'));

  it('links to the pages of the event, then to its presentations', () => {
    const event = events.find(({ occurrences }) =>
      occurrences.some(({ links }) => links.length > 0),
    )!;
    const occurrence = event.occurrences.find(({ links }) => links.length > 0)!;
    show(event.id, occurrence.id);

    expect(hrefs()).toEqual([
      ...occurrence.links.map(link => link.url),
      `/filters?events=${event.id}`,
    ]);
  });

  it('only links to the presentations for an event without links', () => {
    const event = events.find(({ occurrences }) =>
      occurrences.some(({ links }) => links.length === 0),
    )!;
    const occurrence = event.occurrences.find(
      ({ links }) => links.length === 0,
    )!;
    show(event.id, occurrence.id);

    expect(hrefs()).toEqual([`/filters?events=${event.id}`]);
    expect(fixture.nativeElement.textContent).toContain('Presentations');
  });
});
