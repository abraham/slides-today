import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MDCMenu } from '@material/menu/index';
import { MDCRipple } from '@material/ripple/index';
import { Observable } from 'rxjs';
import { Theme } from '../color';
import { DataService } from '../data.service';

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

type Menu = MDCMenu & {
  menuSurface_: {
    root_: {
      addEventListener: (event: string, callback: () => void) => void;
    }
  }
};

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
  constructor(private dataService: DataService) {
    this.theme$ = this.dataService.theme$;
  }

  theme$: Observable<Theme>;

  private menu!: Menu;

  @ViewChild('fabEl') fabEl!: ElementRef;
  @ViewChild('menuEl') menuEl!: ElementRef;
  @Input() text = '';

  private services: { [key: string]: () => string } = {
    twitter: () => `https://twitter.com/intent/tweet?text=${this.shareText()} ${this.shareUrl()}`,
    facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl()}`,
  };

  ngAfterViewInit() {
    this.menu = new MDCMenu(this.menuEl.nativeElement) as Menu;
    this.initRipples();
    this.menu.menuSurface_.root_.addEventListener('MDCMenuSurface:closed', () => this.showFab());
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
      this.fabEl.nativeElement.classList.add('mdc-fab--exited');
      this.menu.open = true;
    }
  }

  private showFab() {
    this.fabEl.nativeElement.classList.remove('mdc-fab--exited');
  }

  private get shareOptions(): ShareOptions {
    return {
      title: 'Slides.Today',
      text: this.text,
      url: window.location.href,
    };
  }

  public share(service: string) {
    this.showFab();
    window.open(this.services[service]());
  }
}
