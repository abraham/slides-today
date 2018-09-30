import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Link } from '../link';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.scss']
})
export class EmbedComponent implements OnInit {
  @Input() link!: Link;
  @Input() width!: number;
  @Input() colors!: { color: string, backgroundColor: string };

  url?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { console.log(this.link); }

  ngOnInit() {
    this.setUrl();
  }

  height(): number {
    return Math.round((this.width + 29) * this.ratioService[this.link.service]);
  }

  setUrl(): void {
    const unsafeUrl = this.urlService[this.link.service]();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  get urlService(): { [index: string]: () => string } {
    return {
      'youtube': this.buildYoutubeUrl.bind(this),
      'google-slides': this.buildGoogleSlidesUrl.bind(this),
      'vimeo': this.buildVimeoUrl.bind(this),
    };
  }

  get ratioService(): { [index: string]: number } {
    return {
      'youtube': 315 / 560,
      'google-slides': 569 / 960,
      'vimeo': 340 / 640,
    };
  }

  backgroundColor() {
    return this.colors.backgroundColor.split('#')[1];
  }

  buildVimeoUrl(): string {
    return  `https://player.vimeo.com/video/${this.parseVimeoId()}?title=0&byline=0&portrait=0&color=${this.backgroundColor()}`;
  }

  buildYoutubeUrl(): string {
    return  `https://www.youtube.com/embed/${this.parseYoutubeId()}`;
  }

  buildGoogleSlidesUrl(): string {
    return `${this.link.url}/embed?start=false&loop=false&delayms=30000`;
  }

  parseVimeoId(): string {
    return this.link.url.split('.com/')[1];
  }

  parseYoutubeId(): string {
    return this.link.url.split('?v=')[1];
  }
}
