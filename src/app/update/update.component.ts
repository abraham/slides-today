import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MDCSnackbar } from '@material/snackbar/index';

type Snackbar = MDCSnackbar & {
  labelText: string;
  actionButtonText: string;
  open: () => void;
};

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  constructor() {
    if ('BroadcastChannel' in window) {
      this.precacheUpdates = new BroadcastChannel(this.CHANNEL_NAME);
      this.precacheUpdates.addEventListener('message', this.onMessage.bind(this));
    } else {
      console.log('BroadcastChannel not supported');
    }
  }

  precacheUpdates?: BroadcastChannel;

  private readonly CHANNEL_NAME = 'precache-updates';
  private readonly EVENT_TYPE = 'CACHE_UPDATED';
  private snackbar!: Snackbar;

  @ViewChild('snackbarEl') snackbarEl!: ElementRef;

  ngOnInit() {
    this.snackbar = new MDCSnackbar(this.snackbarEl.nativeElement) as Snackbar;
  }

  reload(): void {
    window.location.reload();
  }

  private onMessage(event: MessageEvent): void {
    if (event && event.data && event.data.type === this.EVENT_TYPE) {
      this.showUpdate();
    }
  }

  private showUpdate(): void {
    this.snackbar.labelText = 'A new version of Slides.today is available.';
    this.snackbar.actionButtonText = 'Reload';
    this.snackbar.open();
  }
}
