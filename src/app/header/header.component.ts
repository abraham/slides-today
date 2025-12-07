import { Location, NgStyle } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DEFAULT_THEME } from '../models/theme';
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
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  imports: [MatToolbar, NgStyle, MatButton, MatIcon, MatIconButton],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private location = inject(Location);
  private router = inject(Router);
  private update = inject(UpdateService);

  @Input() title = 'Slides.today';
  @Input() showBack = false;

  atTop = true;
  theme = DEFAULT_THEME;
  updateAvailable = false;
  deferredInstallPrompt?: PromptEvent;

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.themeService.current$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => (this.theme = theme));
    this.update.$available
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.updateAvailable = true));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredInstallPrompt = event as PromptEvent;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.atTop = window.scrollY === 0;
  }

  openInstallPrompt(): void {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt = undefined;
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  reload(): void {
    window.location.reload();
  }

  goBack(e: MouseEvent | KeyboardEvent): void {
    e.preventDefault();
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
