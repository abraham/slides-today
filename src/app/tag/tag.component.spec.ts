import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipSelectionChange } from '@angular/material/chips';
import { Router, provideRouter } from '@angular/router';

import { TagComponent } from './tag.component';

@Component({ template: '' })
class StubComponent {}

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent],
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
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
    const change = (selected: boolean, isUserInput = true) =>
      ({ selected, isUserInput }) as MatChipSelectionChange;

    beforeEach(() => {
      navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
      navigate.mockResolvedValue(true);
    });

    const showing = (url: string) => TestBed.inject(Router).navigateByUrl(url);

    it('does not navigate when the chip state is set programmatically', () => {
      component.changeSelected(change(true, false), tag);

      expect(navigate).not.toHaveBeenCalled();
    });

    it('does not navigate when rendered for an already selected tag', async () => {
      await showing('/filters;tags=angular');

      const selected = TestBed.createComponent(TagComponent);
      selected.componentRef.setInput('tag', tag);
      selected.detectChanges();

      expect(navigate).not.toHaveBeenCalled();
    });

    it('marks the chip selected when the url selects the tag', async () => {
      await showing('/filters;tags=php,angular');

      expect(component.selected()).toBe(true);
    });

    it('navigates to the tag when none are selected', () => {
      component.changeSelected(change(true), tag);

      expect(navigate).toHaveBeenCalledWith([
        '/filters',
        { tags: ['angular'] },
      ]);
    });

    it('adds the tag to the selected tags', async () => {
      await showing('/filters;tags=php');

      component.changeSelected(change(true), tag);

      expect(navigate).toHaveBeenCalledWith([
        '/filters',
        { tags: ['php', 'angular'] },
      ]);
    });

    it('does not duplicate a tag that is already selected', async () => {
      await showing('/filters;tags=angular');

      component.changeSelected(change(true), tag);

      expect(navigate).toHaveBeenCalledWith([
        '/filters',
        { tags: ['angular'] },
      ]);
    });

    it('removes the tag from the selected tags', async () => {
      await showing('/filters;tags=php,angular');

      component.changeSelected(change(false), tag);

      expect(navigate).toHaveBeenCalledWith(['/filters', { tags: ['php'] }]);
    });

    it('navigates home when the last tag is deselected', async () => {
      await showing('/filters;tags=angular');

      component.changeSelected(change(false), tag);

      expect(navigate).toHaveBeenLastCalledWith(['/']);
    });
  });
});
