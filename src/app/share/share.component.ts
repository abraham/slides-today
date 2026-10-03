import {
  Component,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../services/theme.service';
import { SocialServices } from '../social-services';

const SNACK_BAR_CONFIG = { duration: 2500 };

@Component({
  selector: 'app-share',
  styleUrl: './share.component.scss',
  templateUrl: './share.component.html',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
})
export class ShareComponent {
  private readonly themeService = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);

  readonly shareMenuTrigger =
    viewChild.required<MatMenuTrigger>('shareMenuTrigger');
  readonly text = input('');
  readonly theme = this.themeService.inverted;
  readonly exited = signal(false);
  readonly twitterUrl = computed(() => this.services[SocialServices.twitter]());
  readonly facebookUrl = computed(() =>
    this.services[SocialServices.facebook](),
  );
  readonly linkedinUrl = computed(() =>
    this.services[SocialServices.linkedin](),
  );

  private services: { [key: string]: () => string } = {
    [SocialServices.facebook]: () =>
      `https://www.facebook.com/sharer/sharer.php?u=${this.shareUrl}`,
    [SocialServices.linkedin]: () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${this.shareUrl}`,
    [SocialServices.twitter]: () =>
      `https://twitter.com/intent/tweet?text=${this.shareText} ${this.shareUrl}`,
  };

  private get shareText(): string {
    return encodeURIComponent(this.text());
  }

  private get shareUrl(): string {
    return encodeURIComponent(window.location.href);
  }

  private get shareOptions(): ShareData {
    return {
      text: this.text(),
      title: 'Slides.Today',
      url: window.location.href,
    };
  }

  startShare(): void {
    this.exited.set(true);
    if (navigator.share) {
      // Avoid showing native share menu and custom share menu at the same time
      this.shareMenuTrigger().closeMenu();
      navigator
        .share(this.shareOptions)
        .catch(() =>
          this.snackBar.open('Error sharing', undefined, SNACK_BAR_CONFIG),
        )
        .finally(() => this.exited.set(false));
    } else {
      this.shareMenuTrigger().openMenu();
    }
  }

  copy(): void {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() =>
        this.snackBar.open(
          'URL copied to clipboard',
          undefined,
          SNACK_BAR_CONFIG,
        ),
      )
      .catch(() =>
        this.snackBar.open('Error copying URL', undefined, SNACK_BAR_CONFIG),
      );
  }
}
