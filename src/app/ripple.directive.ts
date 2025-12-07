import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
} from '@angular/core';
import { MDCRipple } from '@material/ripple';

type Style = 'unbounded' | 'bounded' | '';

@Directive({ selector: '[appRipple]' })
export class RippleDirective {
  private el = inject(ElementRef);

  @Input('appRipple') style: Style = '';

  private attached = false;

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
