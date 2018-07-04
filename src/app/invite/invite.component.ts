import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements AfterViewInit {

  constructor() { }

  private dialog!: MDCDialog;
  @ViewChild('fabEl') fabEl!: ElementRef;
  @ViewChild('dialogEl') dialogEl!: ElementRef;

  ngAfterViewInit() {
    this.dialog = new MDCDialog(this.dialogEl.nativeElement);
    this.initRipples();
  }

  initRipples(): void {
    MDCRipple.attachTo(this.fabEl.nativeElement);
    const buttons: HTMLButtonElement[] = this.dialogEl.nativeElement.querySelectorAll('.mdc-button:not(.mdc-ripple-upgraded)');
    Array.from(buttons).forEach(button => {
      MDCRipple.attachTo(button);
    });
  }

  openDialog(event: MouseEvent) {
    this.dialog.show();
  }

  open(url: string) {
    window.open(url);
  }
}
