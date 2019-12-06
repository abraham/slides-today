import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RippleDirective } from '../ripple.directive';

@NgModule({
  declarations: [
    RippleDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RippleDirective,
  ]
})
export class CardModule { }
