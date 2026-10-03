import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Link } from '../models/link';
import { Services } from '../services';

import { EmbedComponent } from './embed.component';

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
  });
});
