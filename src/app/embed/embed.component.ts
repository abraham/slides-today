import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Link } from '../models/link';
import { DEFAULT_THEME } from '../models/theme';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-embed',
  styleUrls: ['./embed.component.scss'],
  templateUrl: './embed.component.html',
  imports: [MatFabButton, MatIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmbedComponent {
  private sanitizer = inject(DomSanitizer);

  readonly title = input('');
  readonly link = input.required<Link>();
  readonly width = input(200);
  readonly theme = input(DEFAULT_THEME);

  readonly height = computed(() =>
    Math.round((this.width() + 29) * this.ratioService[this.link().service]),
  );
  readonly dimensionStyles = computed(() => ({
    height: `${this.height()}px`,
    width: `${this.width()}px`,
  }));
  readonly youtubeId = computed(() =>
    this.link().service === 'youtube' ? this.parsedYoutubeId : undefined,
  );
  readonly url = computed<SafeResourceUrl | undefined>(() => {
    const { service } = this.link();
    if (service === 'youtube') {
      return undefined;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.urlService[service](),
    );
  });
  readonly placeholder = signal(true);

  private get urlService(): { [index: string]: () => string } {
    return {
      slides: this.buildGoogleSlidesUrl.bind(this),
      vimeo: this.buildVimeoUrl.bind(this),
    };
  }

  private get ratioService(): { [index: string]: number } {
    return {
      slides: 569 / 960,
      vimeo: 340 / 640,
    };
  }

  private get backgroundColor(): string {
    return this.theme().backgroundColor.split('#')[1];
  }

  private get parsedVimeoId(): string {
    return this.link().url.split('.com/')[1];
  }

  private get parsedYoutubeId(): string {
    return this.link().url.split('?v=')[1];
  }

  private buildVimeoUrl(): string {
    const params = new URLSearchParams({
      byline: '0',
      color: this.backgroundColor,
      portrait: '0',
      title: '0',
    });
    return `https://player.vimeo.com/video/${this.parsedVimeoId}?${params}`;
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
