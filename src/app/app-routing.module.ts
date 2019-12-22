import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { DeckListComponent } from './deck-list/deck-list.component';

const routes: Routes = [
  {
    path: 'decks/:id',
    loadChildren: () => import(/* webpackChunkName: 'deck' */ './deck/deck.module').then(m => m.DeckModule)
  },
  {
    path: '',
    loadChildren: () => import(/* webpackChunkName: 'home' */ './home/home.module').then(m => m.HomeModule)
  },
  {
    path: '**',
    loadChildren: () => import(/* webpackChunkName: 'not-found' */ './not-found/not-found.module').then(m => m.NotFoundModule)
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
