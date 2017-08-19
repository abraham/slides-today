import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple';

@Component({
  selector: 'app-card-action',
  templateUrl: './card-action.component.html',
  styleUrls: ['./card-action.component.css']
})
export class CardActionComponent implements OnInit {
  @Input() url: string;
  @Input() text: string;
  @ViewChild('actionEl') actionEl;

  constructor() { }

  ngOnInit() {
    this.initRipples();
  }

  initRipples() {
    MDCRipple.attachTo(this.actionEl.nativeElement);
  }

  open(): void {
    if (this.url) {
      window.open(this.url);
    }
  }
}
