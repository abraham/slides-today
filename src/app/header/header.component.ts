import { Component, OnInit, Input } from '@angular/core';
import { MDCToolbar } from '@material/toolbar/dist/mdc.toolbar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor() { }

  @Input() title: string;
  toolbar: MDCToolbar;

  ngOnInit() {
    this.initToolbar();
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(document.querySelector('.mdc-toolbar'));
    this.toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');
  }
}
