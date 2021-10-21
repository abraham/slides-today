import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
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
export class DeckListComponent implements OnInit, OnDestroy {
  selectedTagIds$: Observable<string[]>;
  decks: Deck[] = [];
  mobile = false;
  hasSelectedTagIds = false;

  private destroy$ = new Subject();

  constructor(
    private dataService: DataService,
    private themeService: ThemeService,
    private deckService: DeckService,
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.selectedTagIds$ = this.dataService.selectedTagIds$;
  }

  ngOnInit(): void {
    this.themeService.reset();
    this.selectedTagIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedTagIds => {
        this.hasSelectedTagIds = selectedTagIds.length !== 0;
      });
    this.deckService
      .filter(this.selectedTagIds$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(decks => {
        this.decks = this.hasSelectedTagIds ? decks : decks.slice(0, 25);
      });
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ matches }) => (this.mobile = matches));
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => (id ? this.deckService.get(id) : EMPTY)),
    );
    this.route.paramMap
      .pipe(
        map(params => params.get('tags')),
        takeUntil(this.destroy$),
      )
      .subscribe(tags => {
        if (tags) {
          tags.split(',').map(tag => this.selectTag(tag));
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  openTagsSheet(): void {
    this.bottomSheet.open(TagsSheetComponent);
  }

  private selectTag(tag: string): void {
    this.dataService.tagSelection({
      id: tag,
      selected: true,
      updatePath: false,
    });
  }
}
