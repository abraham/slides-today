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
    const { id } = Data.find(deck => !deck.archived)!;

    expect(((await resolve(id)) as Deck).id).toEqual(id);
  });

  it('redirects to the 404 page without changing the URL for an unknown deck', async () => {
    const result = await resolve('unknown');

    expect(result).toBeInstanceOf(RedirectCommand);
    const { redirectTo, navigationBehaviorOptions } = result as RedirectCommand;
    expect(redirectTo.toString()).toBe('/404');
    expect(navigationBehaviorOptions?.skipLocationChange).toBe(true);
  });
});
