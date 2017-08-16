import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Deck } from '../deck';
import { DeckService } from '../deck.service';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { HeaderComponent } from '../header/header.component';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
  providers: [DeckService]
})

export class DecksComponent implements OnInit {
  constructor(private deckService: DeckService,
              private route: ActivatedRoute,
              private location: Location) { }

  decks: Deck[];
  currentTag: string;

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.currentTag = params.get('id');
        return this.deckService.getDecksByTag(params.get('id'));
      })
      .subscribe(decks => this.decks = decks);
  }

  getDecks(): Promise<Deck[]> {
    return this.deckService.getDecks();
  }
}
