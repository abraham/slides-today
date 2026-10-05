import { TestBed } from '@angular/core/testing';
import { RenderMode } from '@angular/ssr';
import { provideRouter } from '@angular/router';
import decks from './decks.data.json';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  const deckRoute = serverRoutes.find(({ path }) => path === 'decks/:id')!;

  it('prerenders the deck pages', () => {
    expect(deckRoute.renderMode).toBe(RenderMode.Prerender);
  });

  it('prerenders the ids of the unarchived decks only', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const getPrerenderParams = (
      deckRoute as unknown as {
        getPrerenderParams: () => Promise<{ id: string }[]>;
      }
    ).getPrerenderParams;

    const params = await TestBed.runInInjectionContext(getPrerenderParams);

    expect(params.map(({ id }) => id)).toEqual(
      decks.filter(deck => !deck.archived).map(({ id }) => id),
    );
    expect(params.length).toBeLessThan(decks.length);
  });

  it('renders every other route on request', () => {
    const fallback = serverRoutes.find(({ path }) => path === '**')!;

    expect(fallback.renderMode).toBe(RenderMode.Server);
  });
});
