import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService } from '../services/data.service';

import { TagChipsComponent } from './tag-chips.component';

describe('TagChipsComponent', () => {
  let component: TagChipsComponent;
  let fixture: ComponentFixture<TagChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagChipsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('chips', () => {
    const chips = () =>
      fixture.nativeElement.querySelectorAll('mat-chip-option');

    it('shows every tag by default', () => {
      expect(chips().length).toBe(TestBed.inject(DataService).tags.length);
    });

    it('shows only the current tags when given', () => {
      fixture.componentRef.setInput('currentTags', ['polymer', 'php']);
      fixture.detectChanges();

      expect(chips().length).toBe(2);
    });

    it('follows later changes of the current tags', () => {
      fixture.componentRef.setInput('currentTags', ['polymer', 'php']);
      fixture.detectChanges();
      fixture.componentRef.setInput('currentTags', ['php']);
      fixture.detectChanges();

      expect(chips().length).toBe(1);
    });
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
