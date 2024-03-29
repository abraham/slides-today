import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes } from '@angular/router';
import { DeckDetailsComponent } from '../deck-details/deck-details.component';
import { DeckResourcesComponent } from '../deck-resources/deck-resources.component';
import { EmbedComponent } from '../embed/embed.component';
import { MapComponent } from '../map/map.component';
import { SpeakerComponent } from '../speaker/speaker.component';
import { SponsorComponent } from '../sponsor/sponsor.component';
import { CardModule } from './card.module';
import { SnackBarModule } from './snack-bar.module';
import { TagModule } from './tag.module';

const routes: Routes = [
  {
    component: DeckDetailsComponent,
    path: '',
  },
];

@NgModule({
  declarations: [
    DeckDetailsComponent,
    DeckResourcesComponent,
    EmbedComponent,
    MapComponent,
    SpeakerComponent,
    SponsorComponent,
  ],
  imports: [
    CardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    SnackBarModule,
    TagModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DeckModule {
  constructor() {
    import(/* webpackChunkName: 'components' */ 'github-repository');
    import(/* webpackChunkName: 'components' */ 'node-package');
    import(/* webpackChunkName: 'components' */ 'twitter-status');
    import(/* webpackChunkName: 'components' */ '@justinribeiro/lite-youtube');
  }
}
