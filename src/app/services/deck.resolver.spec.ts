import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  RouterStateSnapshot,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';
import { deckResolver } from './deck.resolver';
import { ThemeService } from './theme.service';

describe('deckResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  const resolve = (id: string) => {
    const route = {
      paramMap: convertToParamMap({ id }),
    } as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() =>
      deckResolver(route, { url: `/decks/${id}` } as RouterStateSnapshot),
    ) as Promise<Deck | RedirectCommand>;
  };

  it('resolves a deck by id', async () => {
    const raw = Data.find(deck => !deck.archived)!;

    expect(((await resolve(raw.id)) as Deck).id).toEqual(raw.id);
  });

  it('applies the deck theme', async () => {
    const raw = Data.find(deck => !deck.archived)!;

    await resolve(raw.id);

    expect(TestBed.inject(ThemeService).current()).toEqual(new Deck(raw).theme);
  });

  it('redirects to the 404 page without changing the URL for an unknown deck', async () => {
    const result = await resolve('unknown');

    expect(result).toBeInstanceOf(RedirectCommand);
    const { redirectTo, navigationBehaviorOptions } = result as RedirectCommand;
    expect(redirectTo.toString()).toBe('/404');
    expect(navigationBehaviorOptions?.skipLocationChange).toBe(true);
  });
});
