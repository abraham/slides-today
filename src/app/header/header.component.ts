import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { MDCToolbar } from '@material/toolbar/dist/mdc.toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor() { }

  @ViewChild('toolbarFixedEl') toolbarFixedEl;
  @ViewChild('toolbarAdjustEl') toolbarAdjustEl;

  @Input() title: string;
  toolbar: MDCToolbar;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initToolbar();
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(this.toolbarFixedEl.nativeElement);
    this.toolbar.fixedAdjustElement = this.toolbarAdjustEl.nativeElement;
  }
}
