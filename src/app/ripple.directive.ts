import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { MDCRipple } from '@material/ripple';

type Style = 'unbounded' | 'bounded';

@Directive({
  selector: '[appRipple]'
})
export class RippleDirective implements AfterViewInit {
  @Input('appRipple') style?: Style;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const ripple = MDCRipple.attachTo(this.el.nativeElement);
    ripple.unbounded = this.style !== 'bounded';
  }
}
