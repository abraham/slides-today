import { inject } from '@angular/core';
import { Router, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { deckListResolver } from './services/deck-list.resolver';
import { deckResolver } from './services/deck.resolver';

const isHome = (url: UrlSegment[]): UrlMatchResult => {
  const noPaths = url.length === 0;
  const filtersPath = url[0]?.path === 'filters';
  const consumed = noPaths || filtersPath ? url : [];
  return { consumed };
};

const loadDeckDetails = () =>
  import('./deck-details/deck-details.component').then(
    m => m.DeckDetailsComponent,
  );

export const routes: Routes = [
  {
    matcher: isHome,
    resolve: { data: deckListResolver },
    loadComponent: () =>
      import('./deck-list/deck-list.component').then(m => m.DeckListComponent),
  },
  {
    path: 'decks/:id',
    loadComponent: loadDeckDetails,
    resolve: { deck: deckResolver },
    // An empty headerTitle clears the site title in the app bar.
    data: { showBack: true, headerTitle: '' },
  },
  {
    path: 'decks',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    // Keeps old /tags;tags=a,b links working.
    path: 'tags',
    pathMatch: 'full',
    redirectTo: ({ url }) =>
      inject(Router).createUrlTree(['/filters'], {
        queryParams: url[0]?.parameters,
      }),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
