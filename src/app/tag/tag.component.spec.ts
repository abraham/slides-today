import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipSelectionChange } from '@angular/material/chips';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tag', {
      id: 'angular',
      primaryColor: '#fff',
      complementaryColor: '#000',
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('applies the tag colors as CSS custom properties', () => {
    const chip: HTMLElement =
      fixture.nativeElement.querySelector('mat-chip-option');
    expect(
      chip.style.getPropertyValue('--mat-chip-elevated-container-color'),
    ).toEqual('#fff');
    expect(chip.style.getPropertyValue('--mat-chip-label-text-color')).toEqual(
      '#000',
    );
  });

  describe('changeSelected', () => {
    let navigate: ReturnType<typeof vi.spyOn>;
    const tag = {
      id: 'angular',
      primaryColor: '#fff',
      complementaryColor: '#000',
    };
    const change = (selected: boolean) =>
      ({ selected }) as MatChipSelectionChange;

    beforeEach(() => {
      navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
      navigate.mockResolvedValue(true);
    });

    it('selects the tag and navigates to the selected tags', () => {
      component.changeSelected(change(true), tag);

      expect(TestBed.inject(DataService).selectedTagIds()).toEqual(['angular']);
      expect(navigate).toHaveBeenCalledWith(['/tags', { tags: ['angular'] }]);
    });

    it('navigates home when the last tag is deselected', () => {
      component.changeSelected(change(true), tag);
      component.changeSelected(change(false), tag);

      expect(navigate).toHaveBeenLastCalledWith(['/']);
    });
  });
});
