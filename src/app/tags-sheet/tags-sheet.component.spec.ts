import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService } from '../services/data.service';

import { TagsSheetComponent } from './tags-sheet.component';

describe('TagsSheetComponent', () => {
  let component: TagsSheetComponent;
  let fixture: ComponentFixture<TagsSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has a heading and a chip for every tag', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h3')?.textContent).toBe('Filtered tags');
    expect(element.querySelectorAll('mat-chip-option').length).toBe(
      TestBed.inject(DataService).tags.length,
    );
  });
});
