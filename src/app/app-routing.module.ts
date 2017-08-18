import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DecksComponent } from './decks/decks.component';

const routes: Routes = [
  {
    path: '**',
    component: DecksComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
