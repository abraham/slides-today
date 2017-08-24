import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { MDCToolbar } from '@material/toolbar/dist/mdc.toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor(private router: Router) { }

  @ViewChild('toolbarFixedEl') toolbarFixedEl;
  @ViewChild('toolbarAdjustEl') toolbarAdjustEl;

  @Input() title: string;
  @Input() colors: { color: string, backgroundColor: string };
  @Input() fixed: boolean;
  toolbar: MDCToolbar;
  defaultClasses = 'mdc-toolbar--fixed mdc-toolbar--waterfall mdc-toolbar--flexible mdc-toolbar--flexible-default-behavior mdc-toolbar--flexible-space-maximized mdc-toolbar--home';
  classes = this.defaultClasses;

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
