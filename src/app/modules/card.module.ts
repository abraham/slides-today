import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RippleDirective } from '../ripple.directive';

@NgModule({
  declarations: [
    RippleDirective,
  ],
  exports: [
    RippleDirective,
  ],
  imports: [
    CommonModule
  ],
})
export class CardModule { }
