import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Link } from '../link';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.css']
})
export class EmbedComponent implements OnInit {
  @Input() link: Link;
  @Input() width: number;

  url: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.setUrl();
  }

  height(): number {
    return Math.round((this.width + 29) * this.ratioService()[this.link.service]);
  }

  setUrl(): void {
    const unsafeUrl = this.urlService()[this.link.service]();
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  urlService(): object {
    return {
      'youtube': this.buildYoutubeUrl.bind(this),
      'google-slides': this.buildGoogleSlidesUrl.bind(this),
    };
  }

  ratioService(): object {
    return {
      'youtube': 315 / 560,
      'google-slides': 569 / 960,
    };
  }

  buildYoutubeUrl(): string {
    return  `https://www.youtube.com/embed/${this.parseYoutubeId()}`;
  }

  buildGoogleSlidesUrl(): string {
    return  `${this.link.url}/embed?start=false&loop=false&delayms=30000`;

  }

  parseYoutubeId(): string {
    return this.link.url.split('?v=')[1];
  }
}
