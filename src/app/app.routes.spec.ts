import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DeckListComponent } from './deck-list/deck-list.component';
import { routes } from './app.routes';

describe('routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('selects the tags from the tags query param on the deck list', async () => {
    const harness = await RouterTestingHarness.create();

    const list = await harness.navigateByUrl(
      '/filters?tags=polymer,php',
      DeckListComponent,
    );

    expect(list.selectedTagIds()).toEqual(['polymer', 'php']);
    expect(list.hasSelectedFilters()).toBe(true);
  });

  it('redirects the legacy tags url to filters, keeping the params', async () => {
    const harness = await RouterTestingHarness.create();

    const list = await harness.navigateByUrl(
      '/tags;tags=polymer,php',
      DeckListComponent,
    );

    expect(TestBed.inject(Router).url).toBe('/filters?tags=polymer,php');
    expect(list.selectedTagIds()).toEqual(['polymer', 'php']);
  });

  it('keeps the deck list component when only the filters change', async () => {
    const harness = await RouterTestingHarness.create();
    const list = await harness.navigateByUrl(
      '/filters?tags=polymer',
      DeckListComponent,
    );

    const next = await harness.navigateByUrl(
      '/filters?tags=polymer,php',
      DeckListComponent,
    );

    expect(next).toBe(list);
    expect(list.selectedTagIds()).toEqual(['polymer', 'php']);
  });

  it('shows the deck list at the root without selecting tags', async () => {
    const harness = await RouterTestingHarness.create();

    const list = await harness.navigateByUrl('/', DeckListComponent);

    expect(list.selectedTagIds()).toEqual([]);
  });

  it('clears the selection when navigating back to the root', async () => {
    const harness = await RouterTestingHarness.create();
    const list = await harness.navigateByUrl(
      '/filters?tags=polymer',
      DeckListComponent,
    );

    await harness.navigateByUrl('/', DeckListComponent);

    expect(list.selectedTagIds()).toEqual([]);
  });
});
