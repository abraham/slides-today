import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDCToolbar } from '@material/toolbar/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor(private router: Router) { }

  @ViewChild('toolbarFixedEl') toolbarFixedEl!: ElementRef;
  @ViewChild('toolbarAdjustEl') toolbarAdjustEl!: ElementRef;

  @Input() title!: string;
  @Input() colors!: { color: string, backgroundColor: string };
  @Input() fixed = true;

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

  ngOnInit() {
  }

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
