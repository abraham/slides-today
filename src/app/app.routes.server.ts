import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { DeckService } from './services/deck.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'decks/:id',
    renderMode: RenderMode.Prerender,
    // Legacy and unknown ids are rendered on request, where the resolver redirects them.
    getPrerenderParams: async () =>
      (await inject(DeckService).loaded).map(({ id }) => ({ id })),
  },
  // The home route uses a custom matcher, which server routes cannot target by path.
  { path: '**', renderMode: RenderMode.Server },
];
