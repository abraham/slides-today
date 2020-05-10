import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Link } from '../models/link';
import { DEFAULT_THEME } from '../models/theme';

@Component({
  selector: 'app-embed',
  styleUrls: ['./embed.component.scss'],
  templateUrl: './embed.component.html',
})
export class EmbedComponent implements OnInit, OnChanges {
  @Input() title = '';
  @Input() link!: Link;
  @Input() width = 200;
  @Input() theme = DEFAULT_THEME;

  height = 120;
  url?: SafeResourceUrl;
  youtubeId?: string;
  placeholder = true;
  dimensionStyles = {
    height: `${this.height}px`,
    width: `${this.width}px`,
  };

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.setHeight();
    if (this.link.service === 'youtube') {
      this.youtubeId = this.parsedYoutubeId;
    } else {
      this.setUrl();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.width) {
      this.width = changes.width.currentValue;
      this.setHeight();
      this.dimensionStyles = {
        height: `${this.height}px`,
        width: `${this.width}px`,
      };
    }
  }

  setHeight(): void {
    const height = (this.width + 29) * this.ratioService[this.link.service];
    this.height = Math.round(height);
  }

  private setUrl(): void {
    const unsafeUrl = this.urlService[this.link.service]();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

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

  private get backgroundColor() {
    return this.theme.backgroundColor.split('#')[1];
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
    return `${this.link.url}/embed?${params}`;
  }

  private get parsedVimeoId(): string {
    return this.link.url.split('.com/')[1];
  }

  private get parsedYoutubeId(): string {
    return this.link.url.split('?v=')[1];
  }
}
