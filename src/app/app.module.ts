import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DeckComponent } from './deck/deck.component';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MdChipsModule } from '@angular/material';
import { TagsComponent } from './tags/tags.component';

@NgModule({
  declarations: [
    AppComponent,
    DeckComponent,
    HeaderComponent,
    TagsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MdChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
