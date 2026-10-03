import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';
import { deckResolver } from './deck.resolver';

describe('deckResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('resolves a deck by id', async () => {
    const { id } = Data.find(deck => !deck.archived)!;
    const route = {
      paramMap: convertToParamMap({ id }),
    } as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      deckResolver(route, { url: `/decks/${id}` } as RouterStateSnapshot),
    ) as Observable<Deck>;

    expect((await firstValueFrom(result)).id).toEqual(id);
  });
});
