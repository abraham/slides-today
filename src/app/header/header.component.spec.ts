import { Location } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SwUpdate,
  UnrecoverableStateEvent,
  VersionEvent,
} from '@angular/service-worker';
import { Router } from '@angular/router';
import { WINDOW } from '../window';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let versionUpdates: EventEmitter<VersionEvent>;
  let unrecoverable: EventEmitter<UnrecoverableStateEvent>;
  const fakeWindow = {
    scrollY: 0,
    history: { length: 1 },
    location: { reload: vi.fn() },
  };

  beforeEach(async () => {
    versionUpdates = new EventEmitter<VersionEvent>();
    unrecoverable = new EventEmitter<UnrecoverableStateEvent>();
    fakeWindow.scrollY = 0;
    fakeWindow.history.length = 1;
    fakeWindow.location.reload.mockClear();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: SwUpdate, useValue: { versionUpdates, unrecoverable } },
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

  it('is the banner landmark', () => {
    expect(fixture.nativeElement.getAttribute('role')).toBe('banner');
  });

  it('shows the title', () => {
    fixture.componentRef.setInput('title', 'My deck');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('My deck');
  });

  it('shows the title as the h1 only when there is one', () => {
    fixture.componentRef.setInput('title', 'My deck');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe(
      'My deck',
    );

    fixture.componentRef.setInput('title', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1')).toBeNull();
  });

  it('shows the back link only when requested', () => {
    const back = () => fixture.nativeElement.querySelector('a[href="/"]');
    expect(back()).toBeNull();

    fixture.componentRef.setInput('showBack', true);
    fixture.detectChanges();

    expect(back()).not.toBeNull();
  });

  describe('update button', () => {
    const button = () =>
      fixture.nativeElement.querySelector(
        'button[aria-label="Update Slides.today"]',
      );

    it('is hidden until an update is ready', () => {
      expect(button()).toBeNull();
    });

    it('reloads the page when an update is ready', () => {
      versionUpdates.emit({
        type: 'VERSION_READY',
        currentVersion: { hash: 'a' },
        latestVersion: { hash: 'b' },
      });
      fixture.detectChanges();

      button().click();

      expect(fakeWindow.location.reload).toHaveBeenCalled();
    });
  });

  describe('install button', () => {
    const button = () =>
      fixture.nativeElement.querySelector(
        'button[aria-label="Install Slides.today"]',
      );
    const offerInstall = () => {
      const prompt = vi.fn();
      const event = Object.assign(
        new Event('beforeinstallprompt', { cancelable: true }),
        { prompt },
      );
      window.dispatchEvent(event);
      fixture.detectChanges();
      return { event, prompt };
    };

    it('is hidden until the browser offers an install', () => {
      expect(button()).toBeNull();
    });

    it('is shown when the browser offers an install and keeps the default prompt back', () => {
      const { event } = offerInstall();

      expect(button()).not.toBeNull();
      expect(event.defaultPrevented).toBe(true);
    });

    it('opens the install prompt once and then hides itself', () => {
      const { prompt } = offerInstall();

      button().click();
      fixture.detectChanges();

      expect(prompt).toHaveBeenCalledTimes(1);
      expect(button()).toBeNull();
    });

    it('hides itself once the app is installed', () => {
      offerInstall();

      window.dispatchEvent(new Event('appinstalled'));
      fixture.detectChanges();

      expect(button()).toBeNull();
    });
  });

  it('tracks whether the page is scrolled to the top', () => {
    fakeWindow.scrollY = 120;
    component.onScroll();
    expect(component.atTop()).toBe(false);

    fakeWindow.scrollY = 0;
    component.onScroll();
    expect(component.atTop()).toBe(true);
  });

  it('shows a shadow only when scrolled', () => {
    const toolbar = (): HTMLElement =>
      fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar().classList).not.toContain('scrolled');

    fakeWindow.scrollY = 120;
    component.onScroll();
    fixture.detectChanges();

    expect(toolbar().classList).toContain('scrolled');
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
