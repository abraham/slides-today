import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDCRipple } from '@material/ripple/index';

@Component({
  selector: 'app-card-action',
  templateUrl: './card-action.component.html',
  styleUrls: ['./card-action.component.scss']
})
export class CardActionComponent implements OnInit {
  @Input() url = '';
  @Input() text = '';
  @Input() blank = false;
  @ViewChild('actionEl', { static: true }) actionEl!: ElementRef;

  constructor(private router: Router) { }

  ngOnInit() {
    this.initRipples();
  }

  initRipples() {
    MDCRipple.attachTo(this.actionEl.nativeElement);
  }

  open(event: MouseEvent): void {
    event.preventDefault();
    if (this.blank) {
      window.open(this.url);
    } else {
      this.router.navigate([this.url]);
    }
  }
}
