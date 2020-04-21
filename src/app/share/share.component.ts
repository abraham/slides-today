import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { MDCMenu } from '@material/menu';
import * as clipboard from 'clipboard-polyfill';
import { SocialServices } from '../models/service';
import { DEFAULT_INVERTED_THEME } from '../models/theme';
import { ThemeService } from '../services/theme.service';

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
  styleUrls: ['./share.component.scss'],
  templateUrl: './share.component.html',
})
export class ShareComponent implements AfterContentInit {
  constructor(private themeService: ThemeService) {
    this.themeService.inverted$.subscribe(theme => (this.theme = theme));
  }

  private menu!: MDCMenu;

  @ViewChild('menuEl', { static: true }) menuEl?: ElementRef;
  @Input() text = '';

  theme = DEFAULT_INVERTED_THEME;
  exited = true;
  twitterUrl = '';
  facebookUrl = '';

  private services: { [key: string]: () => string } = {
    [SocialServices.facebook]: () => {
      return `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl}`;
    },
    [SocialServices.twitter]: () => {
      return `https://twitter.com/intent/tweet?text=${this.shareText} ${this.shareUrl}`;
    },
  };

  ngAfterContentInit() {
    if (!this.menuEl) {
      throw new Error('Missing ViewChild menuEl');
    }

    this.menu = new MDCMenu(this.menuEl.nativeElement);
    setTimeout(() => (this.exited = false), 1000);
    this.menu.listen('MDCMenuSurface:closed', () => (this.exited = false));
    this.twitterUrl = this.services[SocialServices.twitter]();
    this.facebookUrl = this.services[SocialServices.facebook]();
  }

  private get shareText(): string {
    return encodeURIComponent(this.text);
  }

  private get shareUrl(): string {
    return encodeURIComponent(window.location.href);
  }

  startShare(): void {
    this.exited = true;
    if (navigator.share) {
      navigator
        .share(this.shareOptions)
        .then(() => console.log('Successful share'))
        .catch((error: Error) => console.log('Error sharing:', error))
        .then(() => (this.exited = false));
    } else {
      this.menu.open = true;
    }
  }

  private get shareOptions(): ShareOptions {
    return {
      text: this.text,
      title: 'Slides.Today',
      url: window.location.href,
    };
  }

  copy() {
    clipboard
      .writeText(window.location.href)
      .catch(() => alert('Error copying URL'));
  }
}
