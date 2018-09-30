import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';

type Dialog = MDCDialog & {
  open: () => void;
};

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements AfterViewInit {
  private dialog!: Dialog;
  @ViewChild('fabEl') fabEl!: ElementRef;
  @ViewChild('dialogEl') dialogEl!: ElementRef;

  ngAfterViewInit() {
    this.dialog = new MDCDialog(this.dialogEl.nativeElement) as Dialog;
    this.initRipples();
  }

  initRipples(): void {
    MDCRipple.attachTo(this.fabEl.nativeElement);
    const buttons: HTMLButtonElement[] = this.dialogEl.nativeElement.querySelectorAll('.mdc-button:not(.mdc-ripple-upgraded)');
    Array.from(buttons).forEach(button => {
      MDCRipple.attachTo(button);
    });
  }

  openDialog(_event: MouseEvent) {
    this.dialog.open();
  }

  open(url: string) {
    window.open(url);
  }
}
