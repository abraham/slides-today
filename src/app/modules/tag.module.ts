import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { TagsComponent } from '../tags/tags.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [TagComponent, TagsComponent],
  exports: [TagComponent, TagsComponent],
  imports: [CommonModule, MatChipsModule],
})
export class TagModule {}
