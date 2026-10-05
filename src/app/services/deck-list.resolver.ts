import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DeckService } from './deck.service';
import { SpeakerService } from './speaker.service';

// The list is rendered on the server, so its data must exist before the client's first render to hydrate it.
export const deckListResolver: ResolveFn<void> = async () => {
  await Promise.all([
    inject(DeckService).loaded,
    inject(SpeakerService).loaded,
  ]);
};
