import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDCTopAppBar } from '@material/top-app-bar';
import { Observable } from 'rxjs';
import { Theme } from '../color';
import { DataService } from '../data.service';
import { UpdateService } from '../update.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  constructor(private dataService: DataService,
              private location: Location,
              private router: Router,
              update: UpdateService) {
    this.theme$ = this.dataService.theme$;
    update.$available.subscribe(() => this.updateAvailable = true);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
    });
  }

  theme$: Observable<Theme>;
  updateAvailable = false;
  deferredInstallPrompt?: Event;

  @Input() title!: string;
  @Input() showBack = false;
  @ViewChild('appBar', { static: true }) appBar!: ElementRef;

  private toolbar?: MDCTopAppBar;

  ngAfterViewInit(): void {
    this.initToolbar();
  }

  openInstallPrompt() {
    if (this.deferredInstallPrompt) {
      // TODO: Remove any
      (this.deferredInstallPrompt as any).prompt();
      this.deferredInstallPrompt = undefined;
    }
  }

  goHome (): void {
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }

  initToolbar(): void {
    this.toolbar = new MDCTopAppBar(this.appBar.nativeElement);
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
