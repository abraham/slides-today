import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DeckListComponent } from './deck-list/deck-list.component';
import { routes } from './app.routes';
import { DataService } from './services/data.service';

describe('routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('binds the tags matrix param to the deck list', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/tags;tags=polymer,php', DeckListComponent);

    expect(TestBed.inject(DataService).selectedTagIds()).toEqual([
      'polymer',
      'php',
    ]);
  });

  it('shows the deck list at the root without selecting tags', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/', DeckListComponent);

    expect(TestBed.inject(DataService).selectedTagIds()).toEqual([]);
  });
});
