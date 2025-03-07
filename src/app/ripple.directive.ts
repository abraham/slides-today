import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MDCRipple } from '@material/ripple';

type Style = 'unbounded' | 'bounded' | '';

@Directive({
  selector: '[appRipple]',
})
export class RippleDirective {
  @Input('appRipple') style: Style = '';

  private attached = false;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    this.attach();
  }

  private attach(): void {
    if (!this.attached) {
      this.attached = true;
      const ripple = MDCRipple.attachTo(this.el.nativeElement);
      ripple.unbounded = this.style !== 'bounded';
    }
  }
}
