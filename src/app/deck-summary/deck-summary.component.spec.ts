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

  it('links to the deck page', () => {
    const deck = new Deck(Data[0]);
    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a.primary-action');

    expect(component.url()).toBe(`/decks/${deck.id}`);
    expect(link.getAttribute('href')).toBe(`/decks/${deck.id}`);
  });

  it('shows the title, event, date and tags of the deck', () => {
    const deck = new Deck(Data[0]);
    const text: string = fixture.nativeElement.textContent;

    expect(text).toContain(deck.title);
    expect(text).toContain(deck.eventTitle);
    expect(text).toContain(deck.date);
  });
});
