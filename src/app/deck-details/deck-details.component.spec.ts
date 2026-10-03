import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';

import { DeckDetailsComponent } from './deck-details.component';

describe('DeckDetailsComponent', () => {
  let component: DeckDetailsComponent;
  let fixture: ComponentFixture<DeckDetailsComponent>;
  let resizeCallback: () => void;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resizeCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    await TestBed.configureTestingModule({
      imports: [DeckDetailsComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('deck', new Deck(Data[0]));
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('halves the embed width when the column is wide', () => {
    const details: HTMLElement = fixture.nativeElement.querySelector('.item');
    vi.spyOn(details, 'getBoundingClientRect').mockReturnValue({
      width: 1000,
    } as DOMRect);
    resizeCallback();
    expect(component.embedWidth()).toEqual(500);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('share component', () => {
    // Created siblings of the test root can outlive their fixture in document.body.
    let baseline: number;
    const shareCount = (): number =>
      document.body.querySelectorAll('app-share').length - baseline;

    beforeEach(() => {
      baseline = document.body.querySelectorAll('app-share').length;
    });

    it('is created once even when the deck changes', async () => {
      fixture.componentRef.setInput('deck', new Deck(Data[3]));
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.dynamicImportSettled();
      fixture.componentRef.setInput('deck', new Deck(Data[5]));
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.dynamicImportSettled();

      expect(shareCount()).toBe(1);
    });

    it('is not created after the component is destroyed', async () => {
      fixture.destroy();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.dynamicImportSettled();

      expect(shareCount()).toBe(0);
    });
  });
});
