import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DataService } from '../services/data.service';

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

  it('selects the tags from the tags param', () => {
    fixture.componentRef.setInput('tags', 'polymer,php');
    fixture.detectChanges();

    expect(TestBed.inject(DataService).selectedTagIds()).toEqual([
      'polymer',
      'php',
    ]);
  });

  it('does not select tags without the tags param', () => {
    expect(TestBed.inject(DataService).selectedTagIds()).toEqual([]);
  });
});
