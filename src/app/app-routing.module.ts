import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { DeckListComponent } from './deck-list/deck-list.component';

const routes: Routes = [
  {
    path: 'decks/:id',
    loadChildren: () => import('./deck/deck.module').then(m => m.DeckModule)
  },
  {
    path: '**',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
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
