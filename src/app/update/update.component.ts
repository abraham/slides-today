import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MDCSnackbar } from '@material/snackbar';

declare global {
  interface Window {
    BroadcastChannel: new(name: string) => BroadcastChannel;
  }
}

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  private readonly CHANNEL_NAME = 'precache-updates';
  private readonly EVENT_TYPE = 'CACHE_UPDATED';

  constructor() { }

  @ViewChild('snackbarEl') snackbarEl!: ElementRef;
  precacheUpdates!: BroadcastChannel;
  private snackbar!: MDCSnackbar;

  ngOnInit() {
    this.snackbar = new MDCSnackbar(this.snackbarEl.nativeElement);
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

  showUpdate(): void {
    const dataObj = {
      message: 'A new version of Slides.today is available.',
      actionText: 'Reload',
      timeout: 5000,
      actionHandler: () => {
        window.location.reload();
      }
    };

    this.snackbar.show(dataObj);
  }
}
