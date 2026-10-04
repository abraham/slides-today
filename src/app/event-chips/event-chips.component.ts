import { Component, computed, inject } from '@angular/core';
import {
  MatChip,
  MatChipAvatar,
  MatChipListbox,
  MatChipOption,
  MatChipSet,
} from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { DataService } from '../services/data.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event-chips',
  styleUrl: './event-chips.component.scss',
  templateUrl: './event-chips.component.html',
  imports: [
    MatChip,
    MatChipAvatar,
    MatChipListbox,
    MatChipOption,
    MatChipSet,
    MatIcon,
  ],
})
export class EventChipsComponent {
  private readonly dataService = inject(DataService);
  private readonly eventService = inject(EventService);

  readonly selectedEvents = computed(() =>
    this.dataService
      .selectedEventIds()
      .map(id => ({ id, title: this.eventService.title(id) ?? id })),
  );

  clear(): void {
    this.dataService.setFilter('events', []);
  }
}
