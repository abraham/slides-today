import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MDCMenu } from '@material/menu';
import { MDCRipple } from '@material/ripple';

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

type NavigatorShare = (options: ShareOptions) => Promise<{}>;

declare global {
  interface Navigator {
    share?: NavigatorShare;
  }
}

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements AfterViewInit {
  private menu!: MDCMenu;

  @ViewChild('fabEl') fabEl!: ElementRef;
  @ViewChild('menuEl') menuEl!: ElementRef;
  @Input() text = '';
  @Input() colors = {
    backgroundColor: '#e91e63',
    color: '#fff'
  };

  private services: { [key: string]: () => string } = {
    google: () => `https://plus.google.com/share?url=${this.shareUrl()}`,
    twitter: () => `https://twitter.com/intent/tweet?text=${this.shareText()} ${this.shareUrl()}`,
    facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl()}`,
  };

  ngAfterViewInit() {
    this.menu = new MDCMenu(this.menuEl.nativeElement);
    this.initRipples();
  }

  private initRipples(): void {
    MDCRipple.attachTo(this.fabEl.nativeElement);
  }

  private shareText(): string {
    return encodeURIComponent(this.text);
  }

  private shareUrl(): string {
    return encodeURIComponent(window.location.href);
  }

  startShare(): void {
    if (navigator.share) {
      navigator.share(this.shareOptions)
        .then(() => console.log('Successful share'))
        .catch((error: Error) => console.log('Error sharing:', error));
    } else {
      this.toggleMenu();
    }
  }

  private get shareOptions(): ShareOptions {
    return {
      title: 'Slides.Today',
      text: this.text,
      url: window.location.href,
    };
  }

  private toggleMenu() {
    this.menu.open = !this.menu.open;
  }

  public share(service: string) {
    window.open(this.services[service]());
  }
}
