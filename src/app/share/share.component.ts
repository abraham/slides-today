import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MDCMenu } from '@material/menu';
import * as clipboard from 'clipboard-polyfill';
import { Theme, DEFAULT_THEME, invert } from '../color';
import { DataService } from '../data.service';

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

type Service = 'twitter' | 'facebook' | 'clipboard';

type NavigatorShare = (options: ShareOptions) => Promise<{}>;

declare global {
  interface Navigator {
    share?: NavigatorShare;
  }
}

@Component({
  selector: 'app-share',
  styleUrls: ['./share.component.scss'],
  templateUrl: './share.component.html',
})
export class ShareComponent implements AfterViewInit, OnInit {
  constructor(private dataService: DataService) {
    this.dataService.theme$.subscribe(theme => this.theme = invert(theme));
  }

  private theme = invert(DEFAULT_THEME);
  private menu!: MDCMenu;

  @ViewChild('fabEl', { static: true }) fabEl?: ElementRef;
  @ViewChild('menuEl', { static: true }) menuEl!: ElementRef;
  @Input() text = '';

  private services: { [key: string]: () => string } = {
    facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl}`,
    twitter: () => `https://twitter.com/intent/tweet?text=${this.shareText} ${this.shareUrl}`,
  };

  ngOnInit() {
    this.setTheme();
  }

  ngAfterViewInit() {
    this.menu = new MDCMenu(this.menuEl.nativeElement);
    this.showFab();
    this.menu.listen('MDCMenuSurface:closed', () => this.showFab());
  }


  private setTheme() {
    if (!this.fabEl || !this.theme) { return; }
    this.fabEl.nativeElement.style.color = this.theme.color;
    this.fabEl.nativeElement.style.backgroundColor = this.theme.backgroundColor;
  }

  private get shareText(): string {
    return encodeURIComponent(this.text);
  }

  private get shareUrl(): string {
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
      text: this.text,
      title: 'Slides.Today',
      url: window.location.href,
    };
  }

  share(service: Service) {
    if (service === 'clipboard') {
      clipboard.writeText(window.location.href)
               .catch(() => alert('Error copying URL'));
    } else {
      window.open(this.services[service]());
    }
  }
}
