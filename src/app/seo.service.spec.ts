import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  IncludeSiteTitle,
  SeoService,
} from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let document: Document;

  const meta = (attribute: 'name' | 'property', value: string) =>
    document.head
      .querySelector(`meta[${attribute}="${value}"]`)
      ?.getAttribute('content');

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() =>
    document.head.querySelectorAll('meta').forEach(tag => tag.remove()),
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sets the page title with the site title', () => {
    service.update('Deck', 'About the deck');

    expect(TestBed.inject(Title).getTitle()).toBe('Deck | Slides.today');
  });

  it('sets Open Graph tags as properties so crawlers read them', () => {
    service.update('Deck', 'About the deck');

    expect(meta('property', 'og:title')).toBe('Deck | Slides.today');
    expect(meta('property', 'og:description')).toBe('About the deck');
    expect(meta('name', 'og:title')).toBeUndefined();
  });

  it('sets the Twitter and description tags', () => {
    service.update('Deck', 'About the deck');

    expect(meta('name', 'twitter:title')).toBe('Deck | Slides.today');
    expect(meta('name', 'description')).toBe('About the deck');
    expect(meta('name', 'twitter:description')).toBe('About the deck');
  });

  it('can leave the site title off the page title', () => {
    service.update('Deck', 'About the deck', IncludeSiteTitle.no);

    expect(TestBed.inject(Title).getTitle()).toBe('Deck');
  });

  it('trims a long description to its first sentence within 160 characters', () => {
    service.update('Deck', `First sentence. ${'word '.repeat(100)}`);

    expect(meta('name', 'description')).toBe('First sentence.');
  });

  it('resets to the default title and description', () => {
    service.update('Deck', 'About the deck');
    service.reset();

    expect(TestBed.inject(Title).getTitle()).toBe(DEFAULT_TITLE);
    expect(meta('property', 'og:description')).toBe(DEFAULT_DESCRIPTION);
  });
});
