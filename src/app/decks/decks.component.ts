import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { AboutComponent } from '../about/about.component';
import { Deck } from '../deck';
import { DeckService } from '../deck.service';
import { HeaderComponent } from '../header/header.component';

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
  tags: string[] = [];

  ngOnInit(): void {
    console.log('ngOnInit');
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        return Promise.resolve(params.get('id'));
      })
      .subscribe(tag => this.currentTag = tag);
    this.getTags();
    this.getDecks();
  }

  hidden(deck): boolean {
    return this.currentTag && !deck.tags.includes(this.currentTag);
  }

  hasDecks(): boolean {
    return this.decks && this.decks.length > 0;
  }

  getDecks(): void {
    this.deckService.getDecks().then((decks) => {
      this.decks = decks;
    });
  }

  getTags(): void {
    this.deckService.getDecks().then((decks) => {
      const working: string[] = [];
      decks.map((deck) => {
        deck.tags.map((tag) => {
          if (!working.includes(tag)) {
            working.push(tag);
          }
        });
      });
      this.tags = working.sort();
    });
  }
}
