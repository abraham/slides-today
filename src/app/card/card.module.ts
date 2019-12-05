import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardActionComponent } from '../card-action/card-action.component';

@NgModule({
  declarations: [
    CardActionComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardActionComponent,
  ]
})
export class CardModule { }
