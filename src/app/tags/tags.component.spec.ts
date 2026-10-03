import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsComponent } from './tags.component';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('uses listbox semantics for the tag chips', () => {
    // The chips live in app-tag views, so mat-chip-listbox can't query them and needs an explicit role.
    const listbox = fixture.nativeElement.querySelector('mat-chip-listbox');
    const options = fixture.nativeElement.querySelectorAll('[role="option"]');

    expect(listbox.getAttribute('role')).toBe('listbox');
    expect(options.length).toBe(component.tags().length);
    expect(fixture.nativeElement.querySelector('[role="row"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="grid"]')).toBeNull();
  });
});
