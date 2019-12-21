import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Deck } from '../deck';
import { TagsSheetComponent } from '../tags-sheet/tags-sheet.component';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss'],
})
export class DeckListComponent implements OnInit {
  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              breakpointObserver: BreakpointObserver) {
    this.dataService.resetTheme();
    this.selectedTagIds$ = this.dataService.selectedTagIds$;
    this.decks$ = this.dataService.filterDecks$(this.selectedTagIds$);
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
      switchMap(id => this.dataService.deck$(id)),
    );

    this.route.paramMap.pipe(
      map(params => params.get('tags')),
    ).subscribe(tags => {
      if (tags) {
        tags.split(',').map(tag => {
          this.dataService.tagSelection({ id: tag, selected: true, updatePath: false });
        });
      }
    });
  }

  openTagsSheet() {
    this.bottomSheet.open(TagsSheetComponent);
  }
}
