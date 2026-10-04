import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SpeakerService } from '../services/speaker.service';

import { SpeakerChipsComponent } from './speaker-chips.component';

@Component({ template: '' })
class StubComponent {}

describe('SpeakerChipsComponent', () => {
  let fixture: ComponentFixture<SpeakerChipsComponent>;
  let navigate: ReturnType<typeof vi.spyOn>;
  const speakers = () => TestBed.inject(SpeakerService).speakers;
  const chips = (): HTMLElement[] =>
    Array.from(
      fixture.nativeElement.querySelectorAll(
        'mat-chip-option:not(.clear-chip)',
      ),
    );
  const clearChip = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('.clear-chip');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeakerChipsComponent],
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    }).compileComponents();
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    navigate.mockResolvedValue(true);
    fixture = TestBed.createComponent(SpeakerChipsComponent);
    fixture.detectChanges();
  });

  it('shows a chip for every speaker, sorted by name', () => {
    const names = chips().map(chip => chip.textContent?.trim());

    expect(names).toEqual(speakers().map(speaker => speaker.name));
    expect(names).toEqual([...names].sort((a, b) => a!.localeCompare(b!)));
  });

  it('uses the speaker image as the leading avatar', () => {
    const [first] = speakers();
    const avatar = chips()[0]!.querySelector('img');

    expect(avatar?.getAttribute('src')).toBe(first!.imageUrl);
    expect(avatar?.getAttribute('alt')).toBe('');
  });

  it('marks the chips of the selected speakers', async () => {
    const [first] = speakers();
    await TestBed.inject(Router).navigateByUrl(
      `/filters?speakers=${first!.id}`,
    );
    fixture.detectChanges();

    expect(
      chips().map(chip => chip.classList.contains('mat-mdc-chip-selected')),
    ).toEqual(speakers().map(speaker => speaker.id === first!.id));
  });

  it('deselects the chips when the selection is cleared after a click', async () => {
    const [first] = speakers();
    const router = TestBed.inject(Router);
    chips()[0]!.querySelector('button')!.click();
    await router.navigateByUrl(`/filters?speakers=${first!.id}`);
    fixture.detectChanges();

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(
      chips().some(chip => chip.classList.contains('mat-mdc-chip-selected')),
    ).toBe(false);
  });

  describe('clear chip', () => {
    it('is hidden when no speaker is selected', () => {
      expect(clearChip()).toBeNull();
    });

    it('clears the selected speakers when clicked', async () => {
      await TestBed.inject(Router).navigateByUrl('/filters?speakers=a,b');
      fixture.detectChanges();

      clearChip()!.click();

      expect(navigate).toHaveBeenLastCalledWith(['/']);
    });

    it('keeps the tags when clicked', async () => {
      await TestBed.inject(Router).navigateByUrl(
        '/filters?speakers=a&tags=php',
      );
      fixture.detectChanges();

      clearChip()!.click();

      expect(navigate).toHaveBeenLastCalledWith(['/filters'], {
        queryParams: { speakers: null },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('changeSelected', () => {
    const change = (selected: boolean, isUserInput = true) =>
      ({ selected, isUserInput }) as never;

    it('does not navigate when the chip state is set programmatically', () => {
      fixture.componentInstance.changeSelected(change(true, false), 'a');

      expect(navigate).not.toHaveBeenCalled();
    });

    it('navigates to the speaker when none are selected', () => {
      fixture.componentInstance.changeSelected(change(true), 'a');

      expect(navigate).toHaveBeenCalledWith(['/filters'], {
        queryParams: { speakers: 'a' },
        queryParamsHandling: 'merge',
      });
    });

    it('adds and removes speakers from the selection', async () => {
      await TestBed.inject(Router).navigateByUrl('/filters?speakers=a');
      const { componentInstance } = fixture;

      componentInstance.changeSelected(change(true), 'b');
      expect(navigate).toHaveBeenLastCalledWith(['/filters'], {
        queryParams: { speakers: 'a,b' },
        queryParamsHandling: 'merge',
      });

      componentInstance.changeSelected(change(false), 'a');
      expect(navigate).toHaveBeenLastCalledWith(['/']);
    });

    it('keeps the tags when the last speaker is deselected', async () => {
      await TestBed.inject(Router).navigateByUrl(
        '/filters?speakers=a&tags=php',
      );

      fixture.componentInstance.changeSelected(change(false), 'a');

      expect(navigate).toHaveBeenLastCalledWith(['/filters'], {
        queryParams: { speakers: null },
        queryParamsHandling: 'merge',
      });
    });
  });
});
