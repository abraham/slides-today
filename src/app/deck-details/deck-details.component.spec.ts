import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';

import { DeckDetailsComponent } from './deck-details.component';

describe('DeckDetailsComponent', () => {
  let component: DeckDetailsComponent;
  let fixture: ComponentFixture<DeckDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckDetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { data: of({ deck: new Deck(Data[0]) }) },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
