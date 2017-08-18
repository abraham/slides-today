import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { AppComponent } from './app.component';
import { DeckComponent } from './deck/deck.component';
import { DecksComponent } from './decks/decks.component';
import { HeaderComponent } from './header/header.component';
import { TagsComponent } from './tags/tags.component';

import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { InviteComponent } from './invite/invite.component';
import { CardActionComponent } from './card-action/card-action.component';
import { TagComponent } from './tag/tag.component';

@NgModule({
  declarations: [
    AppComponent,
    DeckComponent,
    DecksComponent,
    HeaderComponent,
    TagsComponent,
    AboutComponent,
    InviteComponent,
    CardActionComponent,
    TagComponent,
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
