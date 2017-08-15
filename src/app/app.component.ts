import { Component } from '@angular/core';
import { Deck } from './deck';
import { DeckService } from './deck.service';
import { OnInit } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { ObservableMedia } from '@angular/flex-layout';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DeckService]
})

export class AppComponent implements OnInit {
  constructor(private deckService: DeckService) { }

  title = 'Slides.today';
  decks: Deck[];

  ngOnInit(): void {
    this.getDecks();
  }

  getDecks(): void {
    this.deckService.getDecks().then(decks => this.decks = decks);
  }
}
