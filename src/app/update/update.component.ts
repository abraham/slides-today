import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MDCSnackbar } from '@material/snackbar/index';

declare global {
  interface Window {
    BroadcastChannel: new(name: string) => BroadcastChannel;
  }
}

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
  private readonly CHANNEL_NAME = 'precache-updates';
  private readonly EVENT_TYPE = 'CACHE_UPDATED';

  constructor() { }

  @ViewChild('snackbarEl', { static: true }) snackbarEl!: ElementRef;
  precacheUpdates!: BroadcastChannel;
  private snackbar!: Snackbar;

  ngOnInit() {
    this.snackbar = new MDCSnackbar(this.snackbarEl.nativeElement) as Snackbar;
    if ('BroadcastChannel' in window) {
      this.precacheUpdates = new window.BroadcastChannel(this.CHANNEL_NAME);
      this.precacheUpdates.onmessage = this.onPrecacheUpdate.bind(this);
    } else {
      console.log('BroadcastChannel not supported');
    }
  }

  onPrecacheUpdate(event: MessageEvent): void {
    if (event && event.data && event.data.type === this.EVENT_TYPE) {
      this.showUpdate();
    }
  }

  reload(): void {
    window.location.reload();
  }

  showUpdate(): void {
    this.snackbar.labelText = 'A new version of Slides.today is available.';
    this.snackbar.actionButtonText = 'Reload';
    this.snackbar.open();
  }
}
