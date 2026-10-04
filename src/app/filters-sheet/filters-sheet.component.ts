import { Component } from '@angular/core';
import { TagChipsComponent } from '../tag-chips/tag-chips.component';
import { SpeakerChipsComponent } from '../speaker-chips/speaker-chips.component';
import { EventChipsComponent } from '../event-chips/event-chips.component';

@Component({
  selector: 'app-filters-sheet',
  styleUrl: './filters-sheet.component.scss',
  templateUrl: './filters-sheet.component.html',
  imports: [TagChipsComponent, SpeakerChipsComponent, EventChipsComponent],
})
export class FiltersSheetComponent {}
