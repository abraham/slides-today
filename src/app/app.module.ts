import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardActionComponent } from './card-action/card-action.component';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckSummaryComponent } from './deck-summary/deck-summary.component';
import { EmbedComponent } from './embed/embed.component';
import { HeaderComponent } from './header/header.component';
import { InviteComponent } from './invite/invite.component';
import { MapComponent } from './map/map.component';
import { ShareComponent } from './share/share.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { TagComponent } from './tag/tag.component';
import { TagsComponent } from './tags/tags.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    CardActionComponent,
    DeckDetailsComponent,
    DeckListComponent,
    DeckSummaryComponent,
    EmbedComponent,
    HeaderComponent,
    InviteComponent,
    MapComponent,
    ShareComponent,
    SpeakerComponent,
    SponsorComponent,
    TagComponent,
    TagsComponent,
    UpdateComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    LazyLoadImageModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
