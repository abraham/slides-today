import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Deck } from '../models/deck';
import { DeckService } from './deck.service';
import { SpeakerService } from './speaker.service';
import { SponsorService } from './sponsor.service';
import { ThemeService } from './theme.service';

export const deckResolver: ResolveFn<Deck | RedirectCommand> = async route => {
  const deckService = inject(DeckService);
  const router = inject(Router);
  const themeService = inject(ThemeService);
  const speakerService = inject(SpeakerService);
  const sponsorService = inject(SponsorService);

  const id = route.paramMap.get('id');
  // The page renders the speakers and sponsors, and the server stops waiting once navigation ends.
  await Promise.all([speakerService.loaded, sponsorService.loaded]);
  const deck = await deckService.get(id);
  if (!deck) {
    // Realtime Database ids from before the Firestore migration.
    const migrated = await deckService.getByLegacyId(id);
    if (migrated) {
      return new RedirectCommand(
        router.createUrlTree(['/decks', migrated.id]),
        {
          replaceUrl: true,
        },
      );
    }
    return new RedirectCommand(router.parseUrl('/404'), {
      skipLocationChange: true,
    });
  }
  themeService.update(deck.theme);
  return deck;
};
