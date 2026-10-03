import { Location } from '@angular/common';
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Deck } from '../models/deck';
import { DeckService } from './deck.service';
import { ThemeService } from './theme.service';

export const deckResolver: ResolveFn<Deck> = (route, state) => {
  const deckService = inject(DeckService);
  const router = inject(Router);
  const themeService = inject(ThemeService);
  const location = inject(Location);

  return deckService.get(route.paramMap.get('id')).pipe(
    take(1),
    mergeMap((deck: Deck | undefined) => {
      if (deck) {
        themeService.update(deck.theme);
        return of(deck);
      }
      router.navigate(['/404'], { skipLocationChange: true }).then(() => {
        // Workaround for URL changing https://github.com/angular/angular/issues/16981#issuecomment-549330207
        location.replaceState(state.url);
      });
      return NEVER;
    }),
  );
};
