import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { Deck } from '../deck';
import { DeckService } from '../services/deck.service';
import { TagsSheetComponent } from '../tags-sheet/tags-sheet.component';
import { ThemeService } from '../services/theme.service';

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
    this.decks$ = this.deckService.filter(this.selectedTagIds$);
    breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe(({ matches }) => this.mobile = matches);
  }

  selectedTagIds$: Observable<string[]>;
  decks$: Observable<Deck[]>;
  mobile = false;

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.deckService.get(id)),
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
