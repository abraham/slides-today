import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { TagsComponent } from '../tags/tags.component';

@NgModule({
  declarations: [
    TagComponent,
    TagsComponent,
  ],
  exports: [
    TagComponent,
    TagsComponent,
  ],
  imports: [
    CommonModule
  ],
})
export class TagModule { }
