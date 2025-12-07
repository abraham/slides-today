import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Deck } from '../models/deck';
import { SeoService } from '../seo.service';
import { DataService } from '../services/data.service';
import { DeckService } from '../services/deck.service';
import { ThemeService } from '../services/theme.service';
import { TagsSheetComponent } from '../tags-sheet/tags-sheet.component';
import { TagsComponent } from '../tags/tags.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AboutComponent } from '../about/about.component';
import { DeckSummaryComponent } from '../deck-summary/deck-summary.component';
import { AsyncPipe } from '@angular/common';
import { TagListPipe } from '../tag-list.pipe';

@Component({
  selector: 'app-deck-list',
  styleUrls: ['./deck-list.component.scss'],
  templateUrl: './deck-list.component.html',
  imports: [
    TagsComponent,
    MatButton,
    MatIcon,
    AboutComponent,
    DeckSummaryComponent,
    AsyncPipe,
    TagListPipe,
  ],
})
export class DeckListComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private themeService = inject(ThemeService);
  private deckService = inject(DeckService);
  private route = inject(ActivatedRoute);
  private bottomSheet = inject(MatBottomSheet);
  private breakpointObserver = inject(BreakpointObserver);
  private seoService = inject(SeoService);

  selectedTagIds$: Observable<string[]>;
  decks$!: Observable<Deck[]>;
  mobile = false;
  hasSelectedTagIds = false;

  private destroy$ = new Subject();

  constructor() {
    this.selectedTagIds$ = this.dataService.selectedTagIds$;
  }

  ngOnInit(): void {
    this.themeService.reset();
    this.seoService.reset();

    this.selectedTagIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedTagIds => {
        this.hasSelectedTagIds = selectedTagIds.length !== 0;
      });

    this.decks$ = this.deckService.filter(this.selectedTagIds$).pipe(
      withLatestFrom(this.selectedTagIds$),
      map(([decks, selectedTagIds]) => {
        const filteredDecks =
          selectedTagIds.length !== 0 ? decks : decks.slice(0, 100);
        return filteredDecks;
      }),
    );
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
    this.destroy$.next(true);
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
