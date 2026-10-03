import { PlatformLocation } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ThemeService } from '../services/theme.service';

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
  private readonly platformLocation = inject(PlatformLocation);
  private readonly router = inject(Router);

  readonly shareMenuTrigger =
    viewChild.required<MatMenuTrigger>('shareMenuTrigger');
  readonly text = input('');
  readonly theme = this.themeService.inverted;
  readonly exited = signal(false);

  // The page URL changes with navigation, and the component outlives a deck change.
  private readonly url = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.platformLocation.href),
    ),
    { initialValue: this.platformLocation.href },
  );
  private readonly encodedUrl = computed(() => encodeURIComponent(this.url()));
  private readonly encodedText = computed(() =>
    encodeURIComponent(this.text()),
  );

  readonly twitterUrl = computed(
    () =>
      `https://twitter.com/intent/tweet?text=${this.encodedText()} ${this.encodedUrl()}`,
  );
  readonly facebookUrl = computed(
    () => `https://www.facebook.com/sharer/sharer.php?u=${this.encodedUrl()}`,
  );
  readonly linkedinUrl = computed(
    () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${this.encodedUrl()}`,
  );

  startShare(): void {
    this.exited.set(true);
    if (navigator.share) {
      // Avoid showing native share menu and custom share menu at the same time
      this.shareMenuTrigger().closeMenu();
      navigator
        .share({
          text: this.text(),
          title: 'Slides.Today',
          url: this.url(),
        })
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
      .writeText(this.url())
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
