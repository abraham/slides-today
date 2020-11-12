import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagsSheetComponent } from './tags-sheet.component';

describe('TagsSheetComponent', () => {
  let component: TagsSheetComponent;
  let fixture: ComponentFixture<TagsSheetComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TagsSheetComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
