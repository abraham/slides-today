import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DEFAULT_THEME } from '../color';
import { Link } from '../link';

@Component({
  selector: 'app-embed',
  styleUrls: ['./embed.component.scss'],
  templateUrl: './embed.component.html',
})
export class EmbedComponent implements OnInit, OnChanges {
  @Input() title = '';
  @Input() link!: Link;
  @Input() width = 200;
  @Input() colors = DEFAULT_THEME;

  height = 120;
  url?: SafeResourceUrl;
  youtubeId?: string;
  placeholder = true;
  dimensionStyles = {
    height: `${this.height}px`,
    width: `${this.width}px`,
  };

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.setHeight();
    if (this.link.service === 'youtube') {
      this.youtubeId = this.parseYoutubeId();
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
    this.height = Math.round((this.width + 29) * this.ratioService[this.link.service]);
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

  private backgroundColor() {
    return this.colors.backgroundColor.split('#')[1];
  }

  private buildVimeoUrl(): string {
    return  `https://player.vimeo.com/video/${this.parseVimeoId()}?title=0&byline=0&portrait=0&color=${this.backgroundColor()}`;
  }

  private buildGoogleSlidesUrl(): string {
    return `${this.link.url}/embed?start=false&loop=false&delayms=30000`;
  }

  private parseVimeoId(): string {
    return this.link.url.split('.com/')[1];
  }

  private parseYoutubeId(): string {
    return this.link.url.split('?v=')[1];
  }
}
