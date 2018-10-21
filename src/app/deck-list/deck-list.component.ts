import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Deck } from '../deck';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss'],
  providers: [DataService],
})

export class DeckListComponent implements OnInit {
  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
    this.decks$ = this.dataService.decks$;
  }

  decks$: Observable<Deck[]>;
  currentTags: string[] = [];
  tags: string[] = [];
  hasDecks = true;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => {
          this.triggerScroll();
          return Promise.resolve(params.get('tags'));
        }))
      .subscribe(tags => {
        this.currentTags = tags ? tags.split(',') : [];
        this.setHasDecks();
      });
  }

  triggerScroll(): void {
    window.dispatchEvent(new Event('scroll'));
  }

  setHasDecks(): void {
    this.hasDecks = true;
  }
}
