import { Component, inject } from '@angular/core';
import {
  MatChipAvatar,
  MatChipListbox,
  MatChipOption,
  MatChipSelectionChange,
} from '@angular/material/chips';
import { DataService } from '../services/data.service';
import { SpeakerService } from '../services/speaker.service';

@Component({
  selector: 'app-speaker-chips',
  styleUrl: './speaker-chips.component.scss',
  templateUrl: './speaker-chips.component.html',
  imports: [MatChipAvatar, MatChipListbox, MatChipOption],
})
export class SpeakerChipsComponent {
  private readonly dataService = inject(DataService);

  readonly speakers = inject(SpeakerService).speakers;
  readonly selectedSpeakerIds = this.dataService.selectedSpeakerIds;

  changeSelected(event: MatChipSelectionChange, id: string): void {
    // Chips also emit when their selected state is bound, which must not navigate.
    if (!event.isUserInput) {
      return;
    }
    const current = this.selectedSpeakerIds();
    const speakers = event.selected
      ? [...new Set([...current, id])]
      : current.filter(speakerId => speakerId !== id);
    this.dataService.setFilter('speakers', speakers);
  }
}
