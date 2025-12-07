import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  exports: [CardComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule.forChild([]),
    CardComponent,
  ],
})
export class CardModule {}
