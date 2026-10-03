import { Location } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { Router } from '@angular/router';
import { WINDOW } from '../window';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const fakeWindow = {
    scrollY: 0,
    history: { length: 1 },
    location: { reload: vi.fn() },
  };

  beforeEach(async () => {
    fakeWindow.scrollY = 0;
    fakeWindow.history.length = 1;
    fakeWindow.location.reload.mockClear();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: SwUpdate, useValue: { versionUpdates: new EventEmitter() } },
        { provide: WINDOW, useValue: fakeWindow },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('tracks whether the page is scrolled to the top', () => {
    fakeWindow.scrollY = 120;
    component.onScroll();
    expect(component.atTop()).toBe(false);

    fakeWindow.scrollY = 0;
    component.onScroll();
    expect(component.atTop()).toBe(true);
  });

  it('reloads the page', () => {
    component.reload();

    expect(fakeWindow.location.reload).toHaveBeenCalled();
  });

  describe('goBack', () => {
    const click = (): MouseEvent => {
      const event = new MouseEvent('click', { cancelable: true });
      component.goBack(event);
      return event;
    };

    it('goes back in history when there is history', () => {
      fakeWindow.history.length = 3;
      const back = vi.spyOn(TestBed.inject(Location), 'back');
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate');

      const event = click();

      expect(event.defaultPrevented).toBe(true);
      expect(back).toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('goes home when there is no history', () => {
      const back = vi.spyOn(TestBed.inject(Location), 'back');
      const navigate = vi
        .spyOn(TestBed.inject(Router), 'navigate')
        .mockResolvedValue(true);

      click();

      expect(navigate).toHaveBeenCalledWith(['/']);
      expect(back).not.toHaveBeenCalled();
    });
  });
});
