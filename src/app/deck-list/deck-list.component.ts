import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Deck } from '../models/deck';
import { DataService } from '../services/data.service';
import { DeckService } from '../services/deck.service';
import { ThemeService } from '../services/theme.service';
import { TagsSheetComponent } from '../tags-sheet/tags-sheet.component';

@Component({
  selector: 'app-deck-list',
  styleUrls: ['./deck-list.component.scss'],
  templateUrl: './deck-list.component.html',
})
export class DeckListComponent implements OnInit {
  constructor(private dataService: DataService,
              private themeService: ThemeService,
              private deckService: DeckService,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              breakpointObserver: BreakpointObserver) {
    this.themeService.reset();
    this.selectedTagIds$ = this.dataService.selectedTagIds$;
    this.selectedTagIds$.subscribe(selectedTagIds => this.hasSelectedTagIds = selectedTagIds.length !== 0);
    this.deckService.filter(this.selectedTagIds$)
                    .subscribe(decks => this.decks = decks);
    breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe(({ matches }) => this.mobile = matches);
  }

  selectedTagIds$: Observable<string[]>;
  decks: Deck[] = [];
  mobile = false;
  hasSelectedTagIds = false;

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => id ? this.deckService.get(id) : EMPTY),
    );

    this.route.paramMap.pipe(
      map(params => params.get('tags')),
    ).subscribe(tags => {
      if (tags) {
        tags.split(',').map(tag => {
          this.dataService.tagSelection({
            id: tag,
            selected: true,
            updatePath: false,
          });
        });
      }
    });
  }

  openTagsSheet() {
    this.bottomSheet.open(TagsSheetComponent);
  }
}
