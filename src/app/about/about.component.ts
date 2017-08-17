import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewInit {

  constructor() { }

  @ViewChild('actions') actions;

  imageUrl = '/assets/img/about-medium.jpg';

  ngAfterViewInit(): void {
    this.initRipples();
  }

  initRipples(): void {
    const buttons = this.actions.nativeElement.querySelectorAll('.mdc-button:not(.mdc-ripple-upgraded)');
    Array.from(buttons).forEach(button => {
      MDCRipple.attachTo(button);
    });
  }

  openTwitter(handle: string): void {
    window.open(`https://twitter.com/${handle}`);
  }

  open(url: string): void {
    window.open(url);
  }
}
