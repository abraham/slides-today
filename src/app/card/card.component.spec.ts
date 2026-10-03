import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `<app-card><div title>Only a title</div></app-card>`,
})
class TitleOnlyHostComponent {}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applies the theme as Material tokens', () => {
    fixture.componentRef.setInput('theme', {
      backgroundColor: '#123456',
      color: '#abcdef',
    });
    fixture.detectChanges();

    const card: HTMLElement = fixture.nativeElement.querySelector('mat-card');
    expect(card.style.getPropertyValue('--mat-sys-surface-container-low')).toBe(
      '#123456',
    );
    expect(card.style.getPropertyValue('--mat-sys-on-surface')).toBe('#abcdef');
  });

  describe('url', () => {
    const primaryAction = (): HTMLAnchorElement | null =>
      fixture.nativeElement.querySelector('a.primary-action');

    it('is not a link without a url', () => {
      expect(primaryAction()).toBeNull();
      expect(fixture.nativeElement.querySelector('.no-action')).not.toBeNull();
    });

    it('opens an external url in a new tab', () => {
      fixture.componentRef.setInput('url', 'https://example.com/slides');
      fixture.detectChanges();

      expect(primaryAction()?.getAttribute('href')).toBe(
        'https://example.com/slides',
      );
      expect(primaryAction()?.target).toBe('_blank');
      expect(primaryAction()?.rel).toBe('noopener');
    });

    it('navigates within the app for an internal url', () => {
      fixture.componentRef.setInput('url', '/decks/abc');
      fixture.detectChanges();

      expect(primaryAction()?.getAttribute('href')).toBe('/decks/abc');
      expect(primaryAction()?.target).toBe('');
    });
  });

  it('shows a link for each action in a new tab', () => {
    fixture.componentRef.setInput('actions', [
      { title: 'Slides', url: 'https://example.com/slides' },
      { title: 'Video', url: 'https://example.com/video' },
    ]);
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('mat-card-actions a'),
    );
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      'https://example.com/slides',
      'https://example.com/video',
    ]);
    links.forEach(link => expect(link.target).toBe('_blank'));
  });

  it('shows no actions section without actions', () => {
    expect(fixture.nativeElement.querySelector('mat-card-actions')).toBeNull();
  });

  it('shows the image as the card media', () => {
    fixture.componentRef.setInput('image', '/assets/img/a.png');
    fixture.detectChanges();

    const media: HTMLElement = fixture.nativeElement.querySelector('.media');
    expect(media.style.backgroundImage).toContain('/assets/img/a.png');
  });

  it('hides the headings for content slots that are not used', () => {
    const host = TestBed.createComponent(TitleOnlyHostComponent);
    host.detectChanges();
    const display = (selector: string): string =>
      getComputedStyle(host.nativeElement.querySelector(selector)).display;

    expect(display('.title')).not.toBe('none');
    expect(display('.hero')).toBe('none');
    expect(display('.subtitle')).toBe('none');
  });
});
