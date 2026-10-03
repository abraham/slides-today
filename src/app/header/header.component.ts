import { Location } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ThemeService } from '../services/theme.service';
import { UpdateService } from '../services/update.service';
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
    '(window:beforeinstallprompt)': 'onBeforeInstallPrompt($event)',
    '(window:scroll)': 'onScroll()',
  },
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly update = inject(UpdateService);

  readonly title = input('Slides.today');
  readonly showBack = input(false);

  readonly atTop = signal(true);
  readonly theme = this.themeService.current;
  readonly updateAvailable = toSignal(
    this.update.available$.pipe(map(() => true)),
    { initialValue: false },
  );
  readonly deferredInstallPrompt = signal<PromptEvent | undefined>(undefined);

  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredInstallPrompt.set(event as PromptEvent);
  }

  onScroll() {
    this.atTop.set(window.scrollY === 0);
  }

  openInstallPrompt(): void {
    const prompt = this.deferredInstallPrompt();
    if (prompt) {
      prompt.prompt();
      this.deferredInstallPrompt.set(undefined);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  reload(): void {
    window.location.reload();
  }

  goBack(e: MouseEvent): void {
    e.preventDefault();
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
