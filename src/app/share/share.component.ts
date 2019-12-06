import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MDCMenu } from '@material/menu';
import { MDCRipple } from '@material/ripple';
import { Observable } from 'rxjs';
import { Theme } from '../color';
import { DataService } from '../data.service';

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
  constructor(private dataService: DataService) {
    this.theme$ = this.dataService.theme$;
  }

  theme$: Observable<Theme>;

  private menu!: MDCMenu;

  @ViewChild('fabEl', { static: true }) fabEl!: ElementRef;
  @ViewChild('menuEl', { static: true }) menuEl!: ElementRef;
  @Input() text = '';

  private services: { [key: string]: () => string } = {
    twitter: () => `https://twitter.com/intent/tweet?text=${this.shareText()} ${this.shareUrl()}`,
    facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl()}`,
  };

  ngAfterViewInit() {
    this.menu = new MDCMenu(this.menuEl.nativeElement);
    this.initRipples();
    this.showFab();
    this.menu.listen('MDCMenuSurface:closed', () => this.showFab());
  }

  private initRipples(): void {
    MDCRipple.attachTo(this.fabEl.nativeElement);
    [...this.menuEl.nativeElement.querySelectorAll('.mdc-list-item')]
      .map((listItemEl: Element) => new MDCRipple(listItemEl));
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
    window.open(this.services[service]());
  }
}
