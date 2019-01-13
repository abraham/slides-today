import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDCToolbar } from '@material/toolbar/index';
import { Observable } from 'rxjs';
import { Theme } from '../color';
import { DataService } from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  constructor(private dataService: DataService,
              private router: Router) {
    this.theme$ = this.dataService.theme$;
  }

  theme$: Observable<Theme>;

  @Input() title!: string;
  @Input() fixed = true;
  @ViewChild('toolbarFixedEl') toolbarFixedEl!: ElementRef;
  @ViewChild('toolbarAdjustEl') toolbarAdjustEl!: ElementRef;

  private toolbar?: MDCToolbar;
  private defaultClasses = `
    mdc-toolbar--fixed
    mdc-toolbar--flexible
    mdc-toolbar--flexible-default-behavior
    mdc-toolbar--flexible-space-maximized
    mdc-toolbar--home
    mdc-toolbar--waterfall
  `;
  public classes = this.defaultClasses;

  transitionToDetails(): void {
    this.toolbarAdjustEl.nativeElement.style.display = 'none';
    this.classes = 'mdc-toolbar--details';
  }

  transitionToHome(): void {
    this.toolbarAdjustEl.nativeElement.style.display = 'block';
    this.classes = this.defaultClasses;
  }

  ngAfterViewInit(): void {
    this.initToolbar();
  }

  goHome (): void {
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(this.toolbarFixedEl.nativeElement);
    this.toolbar.fixedAdjustElement = this.toolbarAdjustEl.nativeElement;
  }
}
