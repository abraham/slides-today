import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MDCRipple } from '@material/ripple';

type Style = 'unbounded' | 'bounded' | '';

@Directive({
  selector: '[appRipple]',
})
export class RippleDirective {
  private attached = false;

  @Input('appRipple') style: Style = '';

  @HostListener('mouseenter') onMouseEnter() {
    this.attach();
  }

  constructor(private el: ElementRef) {}

  private attach() {
    if (!this.attached) {
      this.attached = true;
      const ripple = MDCRipple.attachTo(this.el.nativeElement);
      ripple.unbounded = this.style !== 'bounded';
    }
  }
}
