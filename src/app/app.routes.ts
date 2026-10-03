import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import type { DeckDetailsComponent } from './deck-details/deck-details.component';
import type { DeckListComponent } from './deck-list/deck-list.component';
import { deckResolver } from './services/deck.resolver';

export type RoutedComponents = DeckDetailsComponent | DeckListComponent;

const isHome = (url: UrlSegment[]): UrlMatchResult => {
  const noPaths = url.length === 0;
  const tagsPath = url[0]?.path === 'tags';
  const consumed = noPaths || tagsPath ? url : [];
  return { consumed };
};

const loadDeckDetails = () => {
  // Web components used by the deck page; loaded without blocking navigation.
  import('github-repository');
  import('node-package');
  import('twitter-status');
  import('@justinribeiro/lite-youtube');
  return import('./deck-details/deck-details.component').then(
    m => m.DeckDetailsComponent,
  );
};

export const routes: Routes = [
  {
    matcher: isHome,
    loadComponent: () =>
      import('./deck-list/deck-list.component').then(m => m.DeckListComponent),
  },
  {
    path: 'decks/:id',
    loadComponent: loadDeckDetails,
    resolve: { deck: deckResolver },
  },
  {
    path: 'decks',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
