import { Component, input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { EventOccurrence } from '../models/event';

@Component({
  selector: 'app-event',
  styleUrl: './event.component.scss',
  templateUrl: './event.component.html',
  imports: [CardComponent],
})
export class EventComponent {
  readonly occurrence = input.required<EventOccurrence>();
}
