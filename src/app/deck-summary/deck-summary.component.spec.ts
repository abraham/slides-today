import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';
import { DeckSummaryComponent } from './deck-summary.component';

describe('DeckSummaryComponent', () => {
  let component: DeckSummaryComponent;
  let fixture: ComponentFixture<DeckSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckSummaryComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('deck', new Deck(Data[0]));
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
