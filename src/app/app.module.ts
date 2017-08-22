import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CardActionComponent } from './card-action/card-action.component';
import { DeckComponent } from './deck/deck.component';
import { DecksComponent } from './decks/decks.component';
import { DetailsComponent } from './details/details.component';
import { HeaderComponent } from './header/header.component';
import { InviteComponent } from './invite/invite.component';
import { TagComponent } from './tag/tag.component';
import { TagsComponent } from './tags/tags.component';
import { ShareComponent } from './share/share.component';
import { UpdateComponent } from './update/update.component';
import { EmbedComponent } from './embed/embed.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    CardActionComponent,
    DeckComponent,
    DecksComponent,
    DetailsComponent,
    HeaderComponent,
    InviteComponent,
    TagComponent,
    TagsComponent,
    ShareComponent,
    UpdateComponent,
    EmbedComponent,
  ],
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
