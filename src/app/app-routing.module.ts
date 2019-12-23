import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { environment } from '../environments/environment';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { DeckListComponent } from './deck-list/deck-list.component';

function isHome(url: UrlSegment[]): UrlMatchResult {
  const noPaths = url.length === 0;
  const tagsPath = url[0]?.path === 'tags';
  const consumed = noPaths || tagsPath ? url : [];
  return { consumed };
}

const routes: Routes = [
  {
    loadChildren: () => import(/* webpackChunkName: 'home' */ './home/home.module').then(m => m.HomeModule),
    matcher: isHome,
  },
  {
    loadChildren: () => import(/* webpackChunkName: 'deck' */ './deck/deck.module').then(m => m.DeckModule),
    path: 'decks/:id',
  },
  {
    path: 'decks',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    loadChildren: () => import(/* webpackChunkName: 'not-found' */ './not-found/not-found.module').then(m => m.NotFoundModule),
    path: '**',
  },
];

const config: ExtraOptions = {
  enableTracing: !environment.production,
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot(routes, config),
  ],
})
export class AppRoutingModule { }

export type RoutedComponents = DeckDetailsComponent | DeckListComponent;
