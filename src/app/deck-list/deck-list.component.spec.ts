import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router, provideRouter } from '@angular/router';
import { DeckService } from '../services/deck.service';
import { TagsSheetComponent } from '../tags-sheet/tags-sheet.component';

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

  describe('without selected tags', () => {
    beforeEach(() => create());

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('shows the about card and at most 100 decks', () => {
      const decks = TestBed.inject(DeckService).decks()!;

      expect(element().querySelector('app-about')).not.toBeNull();
      expect(summaries().length).toBe(Math.min(100, decks.length));
    });

    it('shows the tags instead of the tags button on desktop', () => {
      expect(element().querySelector('app-tags')).not.toBeNull();
      expect(element().querySelector('.action-buttons')).toBeNull();
    });
  });

  describe('with selected tags', () => {
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
        'Nothing found that includes all the following tags',
      );
    });
  });

  describe('on mobile', () => {
    beforeEach(() => create(true));

    it('shows a tags button instead of the tags', () => {
      expect(element().querySelector('app-tags')).toBeNull();
      expect(element().querySelector('.action-buttons')?.textContent).toContain(
        'Tags',
      );
    });

    it('opens the tags sheet from the button', () => {
      const open = vi
        .spyOn(TestBed.inject(MatBottomSheet), 'open')
        .mockReturnValue(undefined as never);

      element().querySelector<HTMLButtonElement>('.action-buttons')!.click();

      expect(open).toHaveBeenCalledWith(TagsSheetComponent);
    });
  });
});
