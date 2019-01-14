import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.dataService.deck$(id)),
    );

    this.route.paramMap.pipe(
      map(params => params.get('tags')),
      tap(() => this.triggerScroll()),
    ).subscribe(tags => {
      if (tags) {
        tags.split(',').map(tag => {
          this.dataService.tagSelection({ id: tag, selected: true, updatePath: false });
        });
      }
    });
  }

  private triggerScroll(): void {
    window.dispatchEvent(new Event('scroll'));
  }
}
