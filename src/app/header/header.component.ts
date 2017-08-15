import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { MDCToolbar } from '@material/toolbar/dist/mdc.toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor() { }

  @ViewChild('toolbarFixed') toolbarFixed;
  @ViewChild('toolbarAdjust') toolbarAdjust;

  @Input() title: string;
  toolbar: MDCToolbar;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initToolbar();
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(this.toolbarFixed.nativeElement);
    this.toolbar.fixedAdjustElement = this.toolbarAdjust.nativeElement;
  }
}
