import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import events from '../events.data.json';
import { EventChipsComponent } from './event-chips.component';

@Component({ template: '' })
class StubComponent {}

describe('EventChipsComponent', () => {
  let fixture: ComponentFixture<EventChipsComponent>;
  let navigate: ReturnType<typeof vi.spyOn>;
  const [first, second] = events;
  const chips = (): HTMLElement[] =>
    Array.from(
      fixture.nativeElement.querySelectorAll('mat-chip:not(.clear-chip)'),
    );
  const titles = (): (string | undefined)[] =>
    chips().map(chip =>
      chip.querySelector('.event-title')?.textContent?.trim(),
    );
  const clearChip = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('.clear-chip');
  const select = async (url: string): Promise<void> => {
    await TestBed.inject(Router).navigateByUrl(url);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventChipsComponent],
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    }).compileComponents();
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
    navigate.mockResolvedValue(true);
    fixture = TestBed.createComponent(EventChipsComponent);
    fixture.detectChanges();
  });

  it('shows nothing when no event is selected', () => {
    expect(fixture.nativeElement.querySelector('mat-chip-set')).toBeNull();
    expect(clearChip()).toBeNull();
  });

  it('shows only the names of the selected events, in order', async () => {
    await select(`/filters?events=${second!.id},${first!.id}`);

    expect(titles()).toEqual([second!.title, first!.title]);
  });

  it('leads each name with the event icon', async () => {
    await select(`/filters?events=${first!.id},${second!.id}`);

    expect(
      chips().map(chip => chip.querySelector('mat-icon')?.textContent?.trim()),
    ).toEqual(['event', 'event']);
  });

  it('shows the id of an unknown event', async () => {
    await select('/filters?events=unknown');

    expect(titles()).toEqual(['unknown']);
  });

  it('clears the selected events when the clear button is clicked', async () => {
    await select(`/filters?events=${first!.id}`);

    expect(
      clearChip()!.querySelector('button')!.getAttribute('aria-label'),
    ).toBe('Clear event selection');
    clearChip()!.click();

    expect(navigate).toHaveBeenLastCalledWith(['/']);
  });

  it('keeps the other filters when cleared', async () => {
    await select(`/filters?events=${first!.id}&tags=php`);

    clearChip()!.click();

    expect(navigate).toHaveBeenLastCalledWith(['/filters'], {
      queryParams: { events: null },
      queryParamsHandling: 'merge',
    });
  });
});
