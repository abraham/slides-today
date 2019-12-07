import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { CardModule } from '../card/card.module';
import { DeckListComponent } from '../deck-list/deck-list.component';
import { DeckSummaryComponent } from '../deck-summary/deck-summary.component';
import { TagModule } from '../tag/tag.module';
import { TagsSheetComponent } from '../tags-sheet/tags-sheet.component';

const routes: Routes = [
  {
    path: '',
    component: DeckListComponent
  },
];

@NgModule({
  declarations: [
    AboutComponent,
    DeckListComponent,
    DeckSummaryComponent,
    TagsSheetComponent,
  ],
  imports: [
    CardModule,
    CommonModule,
    MatBottomSheetModule,
    TagModule,
    RouterModule.forChild(routes),
  ],
  entryComponents: [
    TagsSheetComponent,
  ]
})
export class HomeModule { }
