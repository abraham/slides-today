import { Component, computed, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { EventOccurrence } from '../models/event';
import { Link } from '../models/link';
import { Services } from '../services';

@Component({
  selector: 'app-event',
  styleUrl: './event.component.scss',
  templateUrl: './event.component.html',
  imports: [CardComponent],
})
export class EventComponent {
  readonly occurrence = input.required<EventOccurrence>();

  readonly actions = computed<Link[]>(() => {
    const { eventId, links } = this.occurrence();
    return [
      ...links,
      {
        title: 'Presentations',
        url: `/filters?events=${encodeURIComponent(eventId)}`,
        useAsTag: false,
        service: Services.external,
      },
    ];
  });
}
