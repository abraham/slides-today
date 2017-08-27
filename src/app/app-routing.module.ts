import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DecksComponent } from './decks/decks.component';
import { DeckDetailsComponent } from './deck-details/deck-details.component';

const routes: Routes = [
  {
    path: 'decks/:id',
    component: DeckDetailsComponent,
  },
  {
    path: '**',
    component: DecksComponent,
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
