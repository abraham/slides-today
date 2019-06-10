import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MDCDialog } from '@material/dialog/index';
import { MDCRipple } from '@material/ripple/index';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements AfterViewInit {
  private dialog!: MDCDialog;
  @ViewChild('fabEl', { static: true }) fabEl!: ElementRef;
  @ViewChild('dialogEl', { static: true }) dialogEl!: ElementRef;

  ngAfterViewInit() {
    this.dialog = new MDCDialog(this.dialogEl.nativeElement);
    this.dialog.listen('MDCDialog:closing', () => this.fabEl.nativeElement.classList.remove('mdc-fab--exited'));
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
    this.fabEl.nativeElement.classList.add('mdc-fab--exited');
  }

  open(url: string) {
    window.open(url);
  }
}
