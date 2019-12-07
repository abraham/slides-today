import { Directive, ElementRef } from '@angular/core';
import { MDCRipple } from '@material/ripple';

@Directive({
  selector: '[appRipple]'
})
export class RippleDirective {
  constructor(private el: ElementRef) {
    const ripple = MDCRipple.attachTo(this.el.nativeElement);
    // ripple.unbounded = true;
  }
}
