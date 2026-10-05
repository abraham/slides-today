import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { deckListResolver } from './services/deck-list.resolver';
import { deckResolver } from './services/deck.resolver';

const loadDeckDetails = () =>
  import('./deck-details/deck-details.component').then(
    m => m.DeckDetailsComponent,
  );

export const routes: Routes = [
  {
    // One parent keeps the deck list alive between `/` and `/filters`, and gives the server routes real paths.
    path: '',
    resolve: { data: deckListResolver },
    loadComponent: () =>
      import('./deck-list/deck-list.component').then(m => m.DeckListComponent),
    children: [
      { path: '', children: [] },
      { path: 'filters', children: [] },
    ],
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
    // Component input binding clears inputs that the route data doesn't set.
    data: { text: 'Page Not Found' },
    loadComponent: () =>
      import('./not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
