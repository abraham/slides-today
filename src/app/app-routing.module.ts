import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckDetailsComponent } from './deck-details/deck-details.component';

const routes: Routes = [
  {
    path: 'decks/:id',
    component: DeckDetailsComponent,
  },
  {
    path: '**',
    component: DeckListComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

export type RoutedComponents = DeckDetailsComponent | DeckListComponent;
