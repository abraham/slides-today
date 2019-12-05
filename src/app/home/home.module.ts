import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { CardModule } from '../card/card.module';
import { DeckListComponent } from '../deck-list/deck-list.component';
import { DeckSummaryComponent } from '../deck-summary/deck-summary.component';
import { TagModule } from '../tag/tag.module';

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
  ],
  imports: [
    CardModule,
    CommonModule,
    TagModule,
    RouterModule.forChild(routes),
  ]
})
export class HomeModule { }
