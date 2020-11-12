import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeckDetailsComponent } from './deck-details.component';

describe('DeckDetailsComponent', () => {
  let component: DeckDetailsComponent;
  let fixture: ComponentFixture<DeckDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DeckDetailsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
