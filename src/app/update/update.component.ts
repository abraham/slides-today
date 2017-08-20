import { Component, OnInit, ViewChild } from '@angular/core';
import { MDCSnackbar } from '@material/snackbar/dist/mdc.snackbar';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor() { }

  @ViewChild('snackbarEl') snackbarEl;
  precacheUpdates: any;
  private _snackbar: MDCSnackbar;

  ngOnInit() {
    this._snackbar = new MDCSnackbar(this.snackbarEl.nativeElement);
    if ('BroadcastChannel' in window) {
      this.precacheUpdates = new window.BroadcastChannel('precache-updates');
      this.precacheUpdates.onmessage = this.onPrecacheUpdate.bind(this);
    } else {
      console.log('BroadcastChannel not supported');
    }
  }

  onPrecacheUpdate(event: MessageEvent): void {
    if (event && event.data && event.data.type === 'CACHE_UPDATED') {
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

    this._snackbar.show(dataObj);
  }
}
