import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MDCMenu } from '@material/menu';
import * as clipboard from 'clipboard-polyfill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocialServices } from '../models/service';
import { DEFAULT_INVERTED_THEME } from '../models/theme';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-share',
  styleUrls: ['./share.component.scss'],
  templateUrl: './share.component.html',
})
export class ShareComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('menuEl', { static: true }) menuEl?: ElementRef;
  @Input() text = '';
  theme = DEFAULT_INVERTED_THEME;
  exited = true;
  twitterUrl = '';
  facebookUrl = '';

  private destroy$ = new Subject();
  private menu!: MDCMenu;
  private services: { [key: string]: () => string } = {
    [SocialServices.facebook]: () =>
      `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl}`,
    [SocialServices.twitter]: () =>
      `https://twitter.com/intent/tweet?text=${this.shareText} ${this.shareUrl}`,
  };

  constructor(
    private themeService: ThemeService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.themeService.inverted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => (this.theme = theme));
  }

  ngAfterContentInit(): void {
    if (!this.menuEl) {
      throw new Error('Missing ViewChild menuEl');
    }

    this.menu = new MDCMenu(this.menuEl.nativeElement);
    setTimeout(() => (this.exited = false), 1000);
    this.menu.listen('MDCMenuSurface:closed', () => (this.exited = false));
    this.twitterUrl = this.services[SocialServices.twitter]();
    this.facebookUrl = this.services[SocialServices.facebook]();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
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
        .catch(() => this.snackBar.open('Error sharing'))
        .then(() => (this.exited = false));
    } else {
      this.menu.open = true;
    }
  }

  private get shareOptions(): ShareData {
    return {
      text: this.text,
      title: 'Slides.Today',
      url: window.location.href,
    };
  }

  copy(): void {
    clipboard
      .writeText(window.location.href)
      .then(() => this.snackBar.open('URL copied to clipboard'))
      .catch(() => this.snackBar.open('Error copying URL'));
  }
}
