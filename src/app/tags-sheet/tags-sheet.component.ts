import { Component } from '@angular/core';
import { TagsComponent } from '../tags/tags.component';
import { SpeakerChipsComponent } from '../speaker-chips/speaker-chips.component';

@Component({
  selector: 'app-tags-sheet',
  styleUrl: './tags-sheet.component.scss',
  templateUrl: './tags-sheet.component.html',
  imports: [TagsComponent, SpeakerChipsComponent],
})
export class TagsSheetComponent {}
