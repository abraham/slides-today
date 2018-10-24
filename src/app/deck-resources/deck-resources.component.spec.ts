import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckResourcesComponent } from './deck-resources.component';

describe('DeckResourcesComponent', () => {
  let component: DeckResourcesComponent;
  let fixture: ComponentFixture<DeckResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
