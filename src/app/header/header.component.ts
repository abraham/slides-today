import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDCTopAppBar } from '@material/top-app-bar';
import { DEFAULT_THEME } from '../models/theme';
import { ThemeService } from '../services/theme.service';
import { UpdateService } from '../services/update.service';

interface PromptEvent extends Event {
  prompt: () => void;
}

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit {
  constructor(private themeService: ThemeService,
              private location: Location,
              private router: Router,
              update: UpdateService) {
    this.themeService.current$.subscribe(theme => this.theme = theme);
    update.$available.subscribe(() => this.updateAvailable = true);

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredInstallPrompt = e as PromptEvent;
    });
  }

  theme = DEFAULT_THEME;
  updateAvailable = false;
  deferredInstallPrompt?: PromptEvent;

  @Input() title = 'Slides.today';
  @Input() showBack = false;
  @ViewChild('appBar', { static: true }) appBarEl?: ElementRef;

  ngAfterViewInit(): void {
    if (!this.appBarEl) {
      throw new Error('Missing ViewChild appBarEl');
    }

    MDCTopAppBar.attachTo(this.appBarEl.nativeElement);
  }

  openInstallPrompt() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt = undefined;
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
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
