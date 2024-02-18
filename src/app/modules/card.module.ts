import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { RippleDirective } from '../ripple.directive';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CardComponent, RippleDirective],
  exports: [CardComponent, RippleDirective],
  imports: [CommonModule, MatButtonModule, RouterModule.forChild([])],
})
export class CardModule {}
