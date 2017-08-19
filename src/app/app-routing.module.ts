import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DecksComponent } from './decks/decks.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: 'decks/:id',
    component: DetailsComponent,
  },
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
