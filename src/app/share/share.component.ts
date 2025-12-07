import {
  AfterContentInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DEFAULT_INVERTED_THEME } from '../models/theme';
import { ThemeService } from '../services/theme.service';
import { SocialServices } from '../social-services';

@Component({
  selector: 'app-share',
  styleUrls: ['./share.component.scss'],
  templateUrl: './share.component.html',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
})
export class ShareComponent implements OnInit, AfterContentInit, OnDestroy {
  private themeService = inject(ThemeService);
  private snackBar = inject(MatSnackBar);

  @ViewChild('shareMenuTrigger', { static: true })
  shareMenuTrigger!: MatMenuTrigger;
  @Input() text = '';
  theme = DEFAULT_INVERTED_THEME;
  exited = true;
  twitterUrl = '';
  facebookUrl = '';
  linkedinUrl = '';

  private destroy$ = new Subject();
  private services: { [key: string]: () => string } = {
    [SocialServices.facebook]: () =>
      `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl}`,
    [SocialServices.linkedin]: () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${this.shareUrl}`,
    [SocialServices.twitter]: () =>
      `https://twitter.com/intent/tweet?text=${this.shareText} ${this.shareUrl}`,
  };

  private get shareText(): string {
    return encodeURIComponent(this.text);
  }

  private get shareUrl(): string {
    return encodeURIComponent(window.location.href);
  }

  private get shareOptions(): ShareData {
    return {
      text: this.text,
      title: 'Slides.Today',
      url: window.location.href,
    };
  }

  ngOnInit(): void {
    this.themeService.inverted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => (this.theme = theme));
  }

  ngAfterContentInit(): void {
    if (!this.shareMenuTrigger) {
      throw new Error('Missing ViewChild menu');
    }

    this.exited = false;
    this.shareMenuTrigger.menuClosed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.exited = false));
    this.linkedinUrl = this.services[SocialServices.linkedin]();
    this.facebookUrl = this.services[SocialServices.facebook]();
    this.twitterUrl = this.services[SocialServices.twitter]();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  startShare(): void {
    this.exited = true;
    if (navigator.share) {
      // Avoid showing native share menu and custom share menu at the same time
      this.shareMenuTrigger.closeMenu();
      navigator
        .share(this.shareOptions)
        .catch(() => this.snackBar.open('Error sharing'))
        .then(() => (this.exited = false));
    } else {
      this.shareMenuTrigger.openMenu();
    }
  }

  copy(): void {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => this.snackBar.open('URL copied to clipboard'))
      .catch(() => this.snackBar.open('Error copying URL'));
  }
}
