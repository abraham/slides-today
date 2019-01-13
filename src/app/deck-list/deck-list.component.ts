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
})

export class DeckListComponent implements OnInit {
  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
    this.dataService.resetTheme();
    this.selectedTagIds$ = this.dataService.selectedTagIds$;
    this.decks$ = this.dataService.filterDecks$(this.selectedTagIds$);
  }

  selectedTagIds$: Observable<string[]>;
  decks$: Observable<Deck[]>;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => {
          this.triggerScroll();
          return Promise.resolve(params.get('tags'));
        }))
      .subscribe(tags => {
        // this.currentTags = tags ? tags.split(',') : [];
        // this.setHasDecks();
      });

  }

  triggerScroll(): void {
    window.dispatchEvent(new Event('scroll'));
  }
}
