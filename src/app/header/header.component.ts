import { Location } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
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
    '(window:beforeinstallprompt)': 'onBeforeInstallPrompt($event)',
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

  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredInstallPrompt.set(event as PromptEvent);
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
    if (this.window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
