import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { DeckListComponent } from './deck-list/deck-list.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import(/* webpackChunkName: 'home' */ './home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'decks/:id',
    loadChildren: () => import(/* webpackChunkName: 'deck' */ './deck/deck.module').then(m => m.DeckModule)
  },
  {
    path: '**',
    loadChildren: () => import(/* webpackChunkName: 'not-found' */ './not-found/not-found.module').then(m => m.NotFoundModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: !environment.production }),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }

export type RoutedComponents = DeckDetailsComponent | DeckListComponent;
