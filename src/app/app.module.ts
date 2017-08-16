import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DeckComponent } from './deck/deck.component';
import { DecksComponent } from './decks/decks.component';
import { HeaderComponent } from './header/header.component';
import { TagsComponent } from './tags/tags.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DeckComponent,
    DecksComponent,
    HeaderComponent,
    TagsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
