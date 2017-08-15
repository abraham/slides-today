import { Component } from '@angular/core';
import { Deck } from './deck';
import { DeckService } from './deck.service';
import { OnInit } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { ObservableMedia } from '@angular/flex-layout';
import { MDCToolbar } from '@material/toolbar/dist/mdc.toolbar';

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
  toolbar: MDCToolbar;

  ngOnInit(): void {
    this.initToolbar();
    this.getDecks();
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(document.querySelector('.mdc-toolbar'));
    this.toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');
  }

  getDecks(): void {
    this.deckService.getDecks().then(decks => this.decks = decks);
  }
}
