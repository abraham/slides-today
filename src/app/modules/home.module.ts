import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { DeckListComponent } from '../deck-list/deck-list.component';
import { DeckSummaryComponent } from '../deck-summary/deck-summary.component';
import { TagListPipe } from '../tag-list.pipe';
import { TagsSheetComponent } from '../tags-sheet/tags-sheet.component';
import { CardModule } from './card.module';
import { TagModule } from './tag.module';

const routes: Routes = [
  {
    component: DeckListComponent,
    path: '',
  },
];

@NgModule({
  declarations: [
    AboutComponent,
    DeckListComponent,
    DeckSummaryComponent,
    TagListPipe,
    TagsSheetComponent,
  ],
  imports: [
    CardModule,
    CommonModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatIconModule,
    TagModule,
    RouterModule.forChild(routes),
  ],
})
export class HomeModule {}
