import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Deck } from '../models/deck';
import { DeckService } from './deck.service';
import { ThemeService } from './theme.service';

export const deckResolver: ResolveFn<Deck | RedirectCommand> = async route => {
  const deckService = inject(DeckService);
  const router = inject(Router);
  const themeService = inject(ThemeService);

  const deck = await deckService.get(route.paramMap.get('id'));
  if (!deck) {
    return new RedirectCommand(router.parseUrl('/404'), {
      skipLocationChange: true,
    });
  }
  themeService.update(deck.theme);
  return deck;
};
