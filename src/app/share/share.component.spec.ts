import { PlatformLocation } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, provideRouter } from '@angular/router';

import { ShareComponent } from './share.component';

@Component({ template: '' })
class StubComponent {}

describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareComponent],
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('shows the share button initially', () => {
    expect(component.exited()).toBe(false);
    expect(fixture.nativeElement.querySelector('button').style.visibility).toBe(
      'visible',
    );
  });

  describe('startShare with the native share sheet', () => {
    afterEach(() => Reflect.deleteProperty(navigator, 'share'));

    const stubShare = (share: () => Promise<void>) =>
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: vi.fn(share),
      });

    it('shows the button again after sharing', async () => {
      stubShare(() => Promise.resolve());
      const snackBar = vi.spyOn(TestBed.inject(MatSnackBar), 'open');

      component.startShare();
      expect(component.exited()).toBe(true);
      await vi.waitFor(() => expect(component.exited()).toBe(false));

      expect(snackBar).not.toHaveBeenCalled();
    });

    it('reports the error and shows the button again when sharing fails', async () => {
      stubShare(() => Promise.reject(new Error('cancelled')));
      const snackBar = vi.spyOn(TestBed.inject(MatSnackBar), 'open');

      component.startShare();
      await vi.waitFor(() => expect(component.exited()).toBe(false));

      expect(snackBar).toHaveBeenCalledWith(
        'Error sharing',
        undefined,
        expect.anything(),
      );
    });
  });

  describe('share urls', () => {
    it('encode the page url and text for each service', () => {
      fixture.componentRef.setInput('text', 'A deck & more');
      const url = encodeURIComponent(TestBed.inject(PlatformLocation).href);
      const text = encodeURIComponent('A deck & more');

      expect(component.facebookUrl()).toBe(
        `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      );
      expect(component.linkedinUrl()).toBe(
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      );
      expect(component.twitterUrl()).toBe(
        `https://twitter.com/intent/tweet?text=${text} ${url}`,
      );
    });

    it('follow navigation to another page', async () => {
      const location = TestBed.inject(PlatformLocation);
      const before = location.href;
      await TestBed.inject(Router).navigateByUrl('/decks/other');

      const url = encodeURIComponent(location.href);
      expect(location.href).not.toBe(before);
      expect(component.facebookUrl()).toContain(url);
      expect(component.linkedinUrl()).toContain(url);
      expect(component.twitterUrl()).toContain(url);
    });
  });

  it('shows the button again when the menu closes', () => {
    component.exited.set(true);

    component.shareMenuTrigger().menuClosed.emit();

    expect(component.exited()).toBe(false);
  });
});
