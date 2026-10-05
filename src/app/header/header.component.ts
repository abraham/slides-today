import { Location } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UpdateService } from '../services/update.service';
import { WINDOW } from '../window';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

interface PromptEvent extends Event {
  prompt: () => void;
}

@Component({
  selector: 'app-header',
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html',
  imports: [MatToolbar, MatButton, MatIcon, MatIconButton],
  host: {
    role: 'banner',
    '(window:beforeinstallprompt)': 'onBeforeInstallPrompt($event)',
    '(window:appinstalled)': 'onAppInstalled()',
    '(window:scroll)': 'onScroll()',
  },
})
export class HeaderComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly update = inject(UpdateService);
  private readonly window = inject(WINDOW);

  readonly title = input('Slides.today');
  readonly showBack = input(false);

  readonly atTop = signal(true);
  readonly updateAvailable = this.update.available;
  readonly deferredInstallPrompt = signal<PromptEvent | undefined>(undefined);

  // history.length counts the entries before the site, so it can't tell a direct visit from an in-app one.
  private navigations = this.router.navigated ? 1 : 0;

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.navigations++);
  }

  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredInstallPrompt.set(event as PromptEvent);
  }

  onAppInstalled() {
    this.deferredInstallPrompt.set(undefined);
  }

  onScroll() {
    this.atTop.set(this.window.scrollY === 0);
  }

  openInstallPrompt(): void {
    const prompt = this.deferredInstallPrompt();
    if (prompt) {
      prompt.prompt();
      this.deferredInstallPrompt.set(undefined);
    }
  }

  reload(): void {
    this.window.location.reload();
  }

  goBack(e: MouseEvent): void {
    e.preventDefault();
    if (this.navigations > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
