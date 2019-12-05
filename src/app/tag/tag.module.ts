import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TagsComponent } from '../tags/tags.component';
import { TagComponent } from './tag.component';

@NgModule({
  declarations: [
    TagComponent,
    TagsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TagComponent,
    TagsComponent,
  ]
})
export class TagModule { }
