import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-tags-sheet',
  templateUrl: './tags-sheet.component.html',
  styleUrls: ['./tags-sheet.component.css']
})
export class TagsSheetComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<TagsSheetComponent>) {}
}
