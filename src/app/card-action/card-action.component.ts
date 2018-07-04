import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MDCRipple } from '@material/ripple';

@Component({
  selector: 'app-card-action',
  templateUrl: './card-action.component.html',
  styleUrls: ['./card-action.component.scss']
})
export class CardActionComponent implements OnInit {
  @Input() url: string;
  @Input() text: string;
  @Input() blank: boolean;
  @ViewChild('actionEl') actionEl!: ElementRef;

  constructor(private router: Router) { }

  ngOnInit() {
    this.initRipples();
  }

  initRipples() {
    MDCRipple.attachTo(this.actionEl.nativeElement);
  }

  open(event): void {
    event.preventDefault();
    if (this.blank) {
      window.open(this.url);
    } else {
      this.router.navigate([this.url]);
    }
  }
}
