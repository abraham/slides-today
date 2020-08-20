import { ElementRef } from '@angular/core';
import { RippleDirective } from './ripple.directive';

describe('RippleDirective', () => {
  it('should create an instance', () => {
    const ref = new ElementRef(document.createElement('div'));
    const directive = new RippleDirective(ref);
    expect(directive).toBeTruthy();
  });
});
