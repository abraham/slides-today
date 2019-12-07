import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MDCSnackbar } from '@material/snackbar';
import { UpdateService } from '../update.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  constructor(update: UpdateService) {
    update.$available.subscribe(() => this.showUpdate());
  }

  @ViewChild('snackbarEl', { static: true }) snackbarEl!: ElementRef;
  private snackbar!: MDCSnackbar;

  ngOnInit() {
    this.snackbar = new MDCSnackbar(this.snackbarEl.nativeElement);
  }

  reload(): void {
    window.location.reload();
  }

  private showUpdate(): void {
    this.snackbar.labelText = 'A new version of Slides.today is available.';
    this.snackbar.actionButtonText = 'Reload';
    this.snackbar.open();
  }
}
