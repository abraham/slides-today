import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatSnackBarModule],
  exports: [MatSnackBarModule],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class SnackBarModule {}
