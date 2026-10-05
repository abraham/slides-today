import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CARD_HEADING_LEVEL, CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `<app-card>
    <div hero>Hero</div>
    <div title>Title</div>
    <div subtitle>Subtitle</div>
  </app-card>`,
})
class AllSlotsHostComponent {}

@Component({
  imports: [CardComponent],
  providers: [{ provide: CARD_HEADING_LEVEL, useValue: 1 }],
  template: `<app-card>
    <div hero>Hero</div>
    <div title>Title</div>
    <div subtitle>Subtitle</div>
  </app-card>`,
})
class TopLevelHostComponent {}

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
      expect(
        primaryAction()?.querySelector('.visually-hidden')?.textContent,
      ).toBe('(opens in new tab)');
    });

    it('navigates within the app for an internal url', () => {
      fixture.componentRef.setInput('url', '/decks/abc');
      fixture.detectChanges();

      expect(primaryAction()?.getAttribute('href')).toBe('/decks/abc');
      expect(primaryAction()?.target).toBe('');
      expect(primaryAction()?.querySelector('.visually-hidden')).toBeNull();
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
    links.forEach(link =>
      expect(link.querySelector('.visually-hidden')?.textContent).toBe(
        '(opens in new tab)',
      ),
    );
  });

  it('navigates within the app for an internal action', () => {
    fixture.componentRef.setInput('actions', [
      { title: 'Presentations', url: '/filters?events=abc' },
    ]);
    fixture.detectChanges();

    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector('mat-card-actions a');
    expect(link.getAttribute('href')).toBe('/filters?events=abc');
    expect(link.target).toBe('');
    expect(link.querySelector('.visually-hidden')).toBeNull();
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

  describe('heading levels', () => {
    const levels = (
      component: Type<unknown> = AllSlotsHostComponent,
    ): (string | null)[] => {
      const host = TestBed.createComponent(component);
      host.detectChanges();
      return ['.hero', '.title', '.subtitle'].map(selector =>
        host.nativeElement.querySelector(selector).getAttribute('aria-level'),
      );
    };

    it('starts at level 2 by default', () => {
      expect(levels()).toEqual(['2', '3', '4']);
    });

    it('starts at the provided level', () => {
      expect(levels(TopLevelHostComponent)).toEqual(['1', '2', '3']);
    });
  });
});
