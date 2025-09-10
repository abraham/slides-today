import { Component } from '@angular/core';
import { TagsComponent } from '../tags/tags.component';

@Component({
  selector: 'app-tags-sheet',
  styleUrls: ['./tags-sheet.component.scss'],
  templateUrl: './tags-sheet.component.html',
  imports: [TagsComponent],
})
export class TagsSheetComponent {}
