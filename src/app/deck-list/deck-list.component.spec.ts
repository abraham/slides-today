import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckListComponent } from './deck-list.component';

describe('DeckListComponent', () => {
  let component: DeckListComponent;
  let fixture: ComponentFixture<DeckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeckListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
