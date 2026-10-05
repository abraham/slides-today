import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { DeckService } from './services/deck.service';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: 'decks/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      (await inject(DeckService).loaded).map(({ id }) => ({ id })),
  },
  // The query string is the only record of the filters, so Hosting rewrites this to the client shell.
  { path: 'filters', renderMode: RenderMode.Client },
  // A static build cannot prerender or render on request for a wildcard.
  { path: '**', renderMode: RenderMode.Client },
];
