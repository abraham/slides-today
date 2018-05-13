import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Deck } from '../deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss'],
  providers: [DeckService],
})

export class DeckListComponent implements OnInit {
  constructor(private deckService: DeckService,
              private route: ActivatedRoute,
              private location: Location) { }

  decks: Deck[];
  currentTags: string[] = [];
  tags: string[] = [];
  hasDecks = true;

  @ViewChild('tagsEl') tagsEl;

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.triggerScroll();
        return Promise.resolve(params.get('tags'));
      })
      .subscribe(tags => {
        this.currentTags = tags ? tags.split(',') : [];
        this.setHasDecks();
      });
    this.getTags();
    this.getDecks();
  }

  triggerScroll(): void {
    window.dispatchEvent(new Event('scroll'));
  }

  setHasDecks(): void {
    this.hasDecks = true;
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
