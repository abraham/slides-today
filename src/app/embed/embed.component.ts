import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Link } from '../models/link';
import { DEFAULT_THEME } from '../models/theme';
import { Services } from '../services';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

const ALLOWED_ORIGINS = ['https://docs.google.com', 'https://player.vimeo.com'];

const RATIOS: Partial<Record<Services, number>> = {
  [Services.slides]: 569 / 960,
  [Services.vimeo]: 340 / 640,
};

// A Record, so adding a service fails to compile until it has a label.
const BUTTON_LABELS: Record<Services, string> = {
  [Services.external]: 'Show content',
  [Services.joindin]: 'Show event',
  [Services.meetup]: 'Show event',
  [Services.slides]: 'Show slides',
  [Services.vimeo]: 'Show video',
  [Services.youtube]: 'Show video',
};

const isAllowedUrl = (value: string): boolean =>
  URL.canParse(value) && ALLOWED_ORIGINS.includes(new URL(value).origin);

@Component({
  selector: 'app-embed',
  styleUrl: './embed.component.scss',
  templateUrl: './embed.component.html',
  imports: [MatCard, MatFabButton, MatIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmbedComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly title = input('');
  readonly link = input.required<Link>();
  // Undefined until the page is measured in the browser, and the card fills its container.
  readonly width = input<number>();
  readonly theme = input(DEFAULT_THEME);
  // Matches the other cards, which use the default theme instead of the deck's.
  readonly cardColor = DEFAULT_THEME.backgroundColor;

  private readonly ratio = computed(() => RATIOS[this.link().service] ?? 0);
  readonly height = computed(() => {
    const width = this.width();
    return width === undefined
      ? undefined
      : Math.round((width + 29) * this.ratio());
  });
  readonly dimensionStyles = computed(() => {
    const width = this.width();
    return width === undefined
      ? { width: '100%', height: `calc((100cqw + 29px) * ${this.ratio()})` }
      : { height: `${this.height()}px`, width: `${width}px` };
  });
  readonly youtubeId = computed(() =>
    this.link().service === 'youtube' ? this.parsedYoutubeId : undefined,
  );
  readonly url = computed<SafeResourceUrl | undefined>(() => {
    const { service } = this.link();
    const url =
      service === Services.slides
        ? this.buildGoogleSlidesUrl()
        : service === Services.vimeo
          ? this.buildVimeoUrl()
          : undefined;
    // Only trust URLs on known embed origins, since the link data is not validated.
    return url && isAllowedUrl(url)
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : undefined;
  });
  readonly placeholder = signal(true);
  readonly buttonLabel = computed(() => BUTTON_LABELS[this.link().service]);

  constructor() {
    // The element needs a browser, and registers without blocking the render.
    afterRenderEffect(() => {
      if (this.youtubeId()) {
        import('@justinribeiro/lite-youtube');
      }
    });
  }

  private get backgroundColor(): string {
    return this.theme().backgroundColor.replace(/^#/, '');
  }

  private get parsedVimeoId(): string | undefined {
    return this.link().url.split('.com/')[1];
  }

  private get parsedYoutubeId(): string | undefined {
    return this.link().url.split('?v=')[1];
  }

  private buildVimeoUrl(): string | undefined {
    const id = this.parsedVimeoId;
    if (!id) {
      return undefined;
    }
    const params = new URLSearchParams({
      byline: '0',
      color: this.backgroundColor,
      portrait: '0',
      title: '0',
    });
    return `https://player.vimeo.com/video/${id}?${params}`;
  }

  private buildGoogleSlidesUrl(): string {
    const params = new URLSearchParams({
      delayms: '30000',
      loop: 'false',
      start: 'false',
    });
    return `${this.link().url}/embed?${params}`;
  }
}
