import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements AfterViewInit {

  constructor() { }

  _dialog: MDCDialog;
  @ViewChild('fabEl') fabEl;
  @ViewChild('dialogEl') dialogEl;

  ngAfterViewInit() {
    this._dialog = new MDCDialog(this.dialogEl.nativeElement);
    this.initRipples();
  }

  initRipples(): void {
    MDCRipple.attachTo(this.fabEl.nativeElement);
    const buttons = this.dialogEl.nativeElement.querySelectorAll('.mdc-button:not(.mdc-ripple-upgraded)');
    Array.from(buttons).forEach(button => {
      MDCRipple.attachTo(button);
    });
  }

  openDialog(event) {
    this._dialog.lastFocusedTarget = event.target;
    this._dialog.show();
  }

  open(url) {
    window.open(url);
  }
}
