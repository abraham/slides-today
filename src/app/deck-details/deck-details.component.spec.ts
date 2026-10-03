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

  afterEach(() => vi.unstubAllGlobals());

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
});
