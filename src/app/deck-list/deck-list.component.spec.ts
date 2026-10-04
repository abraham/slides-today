import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, provideRouter } from '@angular/router';
import { DeckService } from '../services/deck.service';
import { FiltersSheetComponent } from '../filters-sheet/filters-sheet.component';

import { DeckListComponent } from './deck-list.component';

@Component({ template: '' })
class StubComponent {}

const breakpoints = (matches: boolean) => ({
  observe: () => ({
    subscribe: (next: (state: { matches: boolean }) => void) => {
      next({ matches });
      return { unsubscribe: () => undefined };
    },
  }),
});

describe('DeckListComponent', () => {
  let component: DeckListComponent;
  let fixture: ComponentFixture<DeckListComponent>;

  const create = async (matches = false): Promise<void> => {
    TestBed.overrideProvider(BreakpointObserver, {
      useValue: breakpoints(matches),
    });
    fixture = TestBed.createComponent(DeckListComponent);
    component = fixture.componentInstance;
    // Wait for the deck data so the list renders.
    await TestBed.inject(DeckService).get('unknown');
    fixture.detectChanges();
  };
  const element = (): HTMLElement => fixture.nativeElement;
  const summaries = () => element().querySelectorAll('app-deck-summary');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckListComponent],
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    }).compileComponents();
  });

  describe('without selected filters', () => {
    beforeEach(() => create());

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('shows the about card and at most 100 decks', () => {
      const decks = TestBed.inject(DeckService).decks()!;

      expect(element().querySelector('app-about')).not.toBeNull();
      expect(summaries().length).toBe(Math.min(100, decks.length));
    });

    it('shows the filters instead of the filters button on desktop', () => {
      expect(element().querySelector('app-tag-chips')).not.toBeNull();
      expect(element().querySelector('app-speaker-chips')).not.toBeNull();
      expect(element().querySelector('.action-buttons')).toBeNull();
    });
  });

  describe('with selected filters', () => {
    beforeEach(() => create());

    it('shows only the decks with every selected tag and hides the about card', async () => {
      const deckService = TestBed.inject(DeckService);
      const [tag] = deckService.decks()![0]!.tags;

      await TestBed.inject(Router).navigateByUrl(`/filters?tags=${tag}`);
      fixture.detectChanges();

      expect(element().querySelector('app-about')).toBeNull();
      expect(summaries().length).toBe(deckService.filter([tag!])!.length);
    });

    it('explains when no deck has all of the selected tags', async () => {
      await TestBed.inject(Router).navigateByUrl(
        '/filters?tags=nothing,at-all',
      );
      fixture.detectChanges();

      expect(summaries().length).toBe(0);
      expect(element().textContent).toContain(
        'Nothing found that includes all the following filters: #nothing and #at-all',
      );
    });

    it('shows only the decks with every selected speaker', async () => {
      const deckService = TestBed.inject(DeckService);
      const [speaker] = deckService.decks()!.flatMap(deck => deck.speakerIds);

      await TestBed.inject(Router).navigateByUrl(
        `/filters?speakers=${speaker}`,
      );
      fixture.detectChanges();

      expect(element().querySelector('app-about')).toBeNull();
      expect(summaries().length).toBe(
        deckService.filter([], [speaker!])!.length,
      );
      expect(summaries().length).toBeLessThan(deckService.decks()!.length);
    });
  });

  describe('on mobile', () => {
    beforeEach(() => create(true));

    it('shows a filters button instead of the filters', () => {
      expect(element().querySelector('app-tag-chips')).toBeNull();
      expect(element().querySelector('app-speaker-chips')).toBeNull();
      expect(element().querySelector('.action-buttons')?.textContent).toContain(
        'Filters',
      );
    });

    it('opens the filters sheet from the button', () => {
      const open = vi
        .spyOn(TestBed.inject(MatBottomSheet), 'open')
        .mockReturnValue(undefined as never);

      element().querySelector<HTMLButtonElement>('.action-buttons')!.click();

      expect(open).toHaveBeenCalledWith(FiltersSheetComponent);
    });
  });
});
