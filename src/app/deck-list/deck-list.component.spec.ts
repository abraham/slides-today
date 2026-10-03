import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DeckListComponent } from './deck-list.component';

describe('DeckListComponent', () => {
  let component: DeckListComponent;
  let fixture: ComponentFixture<DeckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckListComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
