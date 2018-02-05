import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MDCRipple } from '@material/ripple';
import { MDCMenu } from '@material/menu';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements AfterViewInit {

  constructor() { }

  _menu: MDCMenu;
  @ViewChild('fabEl') fabEl;
  @ViewChild('menuEl') menuEl;
  @Input() text: string;
  services = {
    google: () => `https://plus.google.com/share?url=${this.shareUrl()}`,
    twitter: () => `https://twitter.com/intent/tweet?text=${this.shareText() + ' ' + this.shareUrl()}`,
    facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl()}`,
  };

  ngAfterViewInit() {
    this._menu = new MDCMenu(this.menuEl.nativeElement);
    this.initRipples();
  }

  initRipples(): void {
    MDCRipple.attachTo(this.fabEl.nativeElement);
  }

  shareText(): string {
    return encodeURIComponent(this.text);
  }

  shareUrl(): string {
    return encodeURIComponent(window.location.href);
  }

  startShare(): void {
    if ('share' in navigator) {
      this.nativeShare();
    } else {
      this.toggleMenu();
    }
  }

  nativeShare(): void {
    navigator.share({
      text: this.text,
      url: window.location.href,
    }).then(() => console.log('Successful share'))
    .catch(error => console.log('Error sharing:', error));

  }

  toggleMenu() {
    this._menu.open = !this._menu.open;
  }

  open(url) {
    window.open(url);
  }

  share(service: string) {
    window.open(this.services[service]());
  }
}
