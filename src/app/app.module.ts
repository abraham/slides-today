import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'twitter-status';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CardActionComponent } from './card-action/card-action.component';
import { DeckSummaryComponent } from './deck-summary/deck-summary.component';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { HeaderComponent } from './header/header.component';
import { InviteComponent } from './invite/invite.component';
import { TagComponent } from './tag/tag.component';
import { TagsComponent } from './tags/tags.component';
import { ShareComponent } from './share/share.component';
import { UpdateComponent } from './update/update.component';
import { EmbedComponent } from './embed/embed.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { AnimationService } from './animation.service';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    CardActionComponent,
    DeckSummaryComponent,
    DeckListComponent,
    DeckDetailsComponent,
    HeaderComponent,
    InviteComponent,
    TagComponent,
    TagsComponent,
    ShareComponent,
    UpdateComponent,
    EmbedComponent,
    SpeakerComponent,
    SponsorComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    LazyLoadImageModule,
  ],
  providers: [AnimationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
