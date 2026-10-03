import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
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

  it('uses the default image as an absolute url', () => {
    service.update('Deck', 'About the deck');

    const image = new URL(DEFAULT_IMAGE, document.baseURI).href;
    expect(meta('property', 'og:image')).toBe(image);
    expect(meta('name', 'twitter:image')).toBe(image);
  });

  it('sets a custom image as an absolute url', () => {
    service.update(
      'Deck',
      'About the deck',
      IncludeSiteTitle.yes,
      '/assets/img/speakers/a.jpg',
    );

    const image = new URL('/assets/img/speakers/a.jpg', document.baseURI).href;
    expect(meta('property', 'og:image')).toBe(image);
    expect(meta('name', 'twitter:image')).toBe(image);
  });

  it('keeps an image that is already absolute', () => {
    service.update(
      'Deck',
      'About the deck',
      IncludeSiteTitle.yes,
      'https://example.com/a.jpg',
    );

    expect(meta('property', 'og:image')).toBe('https://example.com/a.jpg');
  });

  it('describes the image with the page title', () => {
    service.update('Deck', 'About the deck');

    expect(meta('property', 'og:image:alt')).toBe('Deck | Slides.today');
    expect(meta('name', 'twitter:image:alt')).toBe('Deck | Slides.today');
  });

  it('resets to the default title, description and image', () => {
    service.update(
      'Deck',
      'About the deck',
      IncludeSiteTitle.yes,
      '/assets/img/speakers/a.jpg',
    );
    service.reset();

    expect(TestBed.inject(Title).getTitle()).toBe(DEFAULT_TITLE);
    expect(meta('property', 'og:description')).toBe(DEFAULT_DESCRIPTION);
    expect(meta('property', 'og:image')).toBe(
      new URL(DEFAULT_IMAGE, document.baseURI).href,
    );
  });
});
