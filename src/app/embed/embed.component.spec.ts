import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Link } from '../models/link';
import { Services } from '../services';

import { EmbedComponent } from './embed.component';

vi.mock('@justinribeiro/lite-youtube', () => ({}));

describe('EmbedComponent', () => {
  let component: EmbedComponent;
  let fixture: ComponentFixture<EmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('link', {
      title: 'Slides',
      url: 'https://docs.google.com/presentation/d/abc',
      useAsTag: false,
      service: 'slides',
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('enables the embed only when the button is activated', () => {
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector('.action')!.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();
    expect(element.querySelector('iframe')).toBeNull();

    element.querySelector('button')!.click();
    fixture.detectChanges();
    expect(element.querySelector('iframe')).not.toBeNull();
  });

  describe('button label', () => {
    const label = () =>
      fixture.nativeElement.querySelector('button').textContent.trim();

    it('offers to show slides for Google Slides', () => {
      expect(label()).toContain('Show slides');
    });

    it('offers to show the video for Vimeo', () => {
      fixture.componentRef.setInput('link', {
        title: 'Video',
        url: 'https://vimeo.com/123',
        useAsTag: false,
        service: 'vimeo',
      });
      fixture.detectChanges();

      expect(label()).toContain('Show video');
    });
  });

  describe('embed urls', () => {
    const embedSrc = (link: Partial<Link>): string | null => {
      fixture.componentRef.setInput('link', {
        ...fixture.componentInstance.link(),
        ...link,
      });
      fixture.detectChanges();
      const element: HTMLElement = fixture.nativeElement;
      element.querySelector('button')?.click();
      fixture.detectChanges();
      return element.querySelector('iframe')?.getAttribute('src') ?? null;
    };

    it('embeds Google Slides on docs.google.com', () => {
      expect(embedSrc({})).toMatch(
        /^https:\/\/docs\.google\.com\/presentation\/d\/abc\/embed\?/,
      );
    });

    it('embeds Vimeo videos from player.vimeo.com', () => {
      const src = embedSrc({
        service: Services.vimeo,
        url: 'https://vimeo.com/279043106',
      });

      expect(src).toMatch(/^https:\/\/player\.vimeo\.com\/video\/279043106\?/);
    });

    it('does not embed urls on other origins', () => {
      const element: HTMLElement = fixture.nativeElement;

      expect(
        embedSrc({ url: 'https://evil.example/presentation/d/abc' }),
      ).toBeNull();
      expect(element.querySelector('button')).toBeNull();
    });

    it('does not embed a Vimeo link without a video id', () => {
      expect(
        embedSrc({ service: Services.vimeo, url: 'https://vimeo.com' }),
      ).toBeNull();
    });
  });

  describe('sizing', () => {
    it('fills its container with the slide aspect ratio before it is measured', () => {
      expect(component.height()).toBeUndefined();
      expect(component.dimensionStyles()).toEqual({
        width: '100%',
        height: `calc((100cqw + 29px) * ${569 / 960})`,
      });
    });

    it('keeps the slide aspect ratio for the width', () => {
      fixture.componentRef.setInput('width', 500);

      expect(component.height()).toBe(Math.round((500 + 29) * (569 / 960)));
      expect(component.dimensionStyles()).toEqual({
        height: `${component.height()}px`,
        width: '500px',
      });
    });

    it('sizes the iframe like the placeholder', () => {
      fixture.componentRef.setInput('width', 400);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('button').click();
      fixture.detectChanges();

      const iframe: HTMLIFrameElement =
        fixture.nativeElement.querySelector('iframe');
      expect(iframe.getAttribute('width')).toBe('400');
      expect(iframe.getAttribute('height')).toBe(String(component.height()));
    });

    it('titles the iframe with the deck and link', () => {
      fixture.componentRef.setInput('title', 'My deck');
      fixture.detectChanges();
      fixture.nativeElement.querySelector('button').click();
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('iframe').getAttribute('title'),
      ).toBe('My deck Slides');
    });
  });

  describe('YouTube', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('link', {
        title: 'Video',
        url: 'https://www.youtube.com/watch?v=abc123',
        useAsTag: false,
        service: Services.youtube,
      });
      fixture.detectChanges();
    });

    it('uses the lite-youtube element without an enable button', () => {
      const element: HTMLElement = fixture.nativeElement;

      expect(
        element.querySelector('lite-youtube')?.getAttribute('videoid'),
      ).toBe('abc123');
      expect(element.querySelector('button')).toBeNull();
      expect(element.querySelector('iframe')).toBeNull();
    });
  });
});
