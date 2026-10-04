import { Component, computed, inject } from '@angular/core';
import { MatChip, MatChipAvatar, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { findEventTitle } from '../models/event';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-event-chips',
  styleUrl: './event-chips.component.scss',
  templateUrl: './event-chips.component.html',
  imports: [MatChip, MatChipAvatar, MatChipSet, MatIcon],
})
export class EventChipsComponent {
  private readonly dataService = inject(DataService);

  readonly selectedEvents = computed(() =>
    this.dataService
      .selectedEventIds()
      .map(id => ({ id, title: findEventTitle(id) ?? id })),
  );

  clear(): void {
    this.dataService.setFilter('events', []);
  }
}
