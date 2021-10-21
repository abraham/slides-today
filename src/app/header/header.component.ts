import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MDCTopAppBar } from '@material/top-app-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title = 'Slides.today';
  @Input() showBack = false;
  @ViewChild('appBar', { static: true }) appBarEl?: ElementRef;

  theme = DEFAULT_THEME;
  updateAvailable = false;
  deferredInstallPrompt?: PromptEvent;

  private destroy$ = new Subject();

  constructor(
    private themeService: ThemeService,
    private location: Location,
    private router: Router,
    private update: UpdateService,
  ) {}

  ngOnInit(): void {
    this.themeService.current$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => (this.theme = theme));
    this.update.$available
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.updateAvailable = true));

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredInstallPrompt = e as PromptEvent;
    });
  }

  ngAfterViewInit(): void {
    if (!this.appBarEl) {
      throw new Error('Missing ViewChild appBarEl');
    }

    MDCTopAppBar.attachTo(this.appBarEl.nativeElement);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
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

  goBack(e: MouseEvent | KeyboardEvent): void {
    e.preventDefault();
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
