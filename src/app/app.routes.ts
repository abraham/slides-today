import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { deckResolver } from './services/deck.resolver';

const isHome = (url: UrlSegment[]): UrlMatchResult => {
  const noPaths = url.length === 0;
  const tagsPath = url[0]?.path === 'tags';
  const consumed = noPaths || tagsPath ? url : [];
  return { consumed };
};

const loadDeckDetails = () =>
  import('./deck-details/deck-details.component').then(
    m => m.DeckDetailsComponent,
  );

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
    // An empty headerTitle clears the site title in the app bar.
    data: { showBack: true, headerTitle: '' },
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
