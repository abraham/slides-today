import { Component } from '@angular/core';
import { TagsComponent } from '../tags/tags.component';
import { SpeakerChipsComponent } from '../speaker-chips/speaker-chips.component';

@Component({
  selector: 'app-filters-sheet',
  styleUrl: './filters-sheet.component.scss',
  templateUrl: './filters-sheet.component.html',
  imports: [TagsComponent, SpeakerChipsComponent],
})
export class FiltersSheetComponent {}
