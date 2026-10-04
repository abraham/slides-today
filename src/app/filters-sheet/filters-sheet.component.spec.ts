import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService } from '../services/data.service';
import { SpeakerService } from '../services/speaker.service';

import { FiltersSheetComponent } from './filters-sheet.component';

describe('FiltersSheetComponent', () => {
  let component: FiltersSheetComponent;
  let fixture: ComponentFixture<FiltersSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has a heading, a chip for every tag and a chip for every speaker', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h3')?.textContent).toBe('Filter decks');
    expect(
      element.querySelectorAll('app-tag-chips mat-chip-option').length,
    ).toBe(TestBed.inject(DataService).tags.length);
    expect(
      element.querySelectorAll('app-speaker-chips mat-chip-option').length,
    ).toBe(TestBed.inject(SpeakerService).speakers.length);
  });
});
