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
  toolbar: MDCToolbar;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initToolbar();
  }
  goHome (): void {
    this.router.navigate(['/']);
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(this.toolbarFixedEl.nativeElement);
    this.toolbar.fixedAdjustElement = this.toolbarAdjustEl.nativeElement;
  }
}
