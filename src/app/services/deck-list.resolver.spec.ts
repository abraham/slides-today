import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { deckListResolver } from './deck-list.resolver';
import { DeckService } from './deck.service';
import { SpeakerService } from './speaker.service';

describe('deckListResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('resolves once the decks and speakers are loaded', async () => {
    await TestBed.runInInjectionContext(() =>
      deckListResolver({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(TestBed.inject(DeckService).decks()?.length).toBeGreaterThan(0);
    expect(TestBed.inject(SpeakerService).speakers().length).toBeGreaterThan(0);
  });
});
