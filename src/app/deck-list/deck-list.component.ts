import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
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
    TagListPipe,
  ],
})
export class DeckListComponent {
  private dataService = inject(DataService);
  private themeService = inject(ThemeService);
  private deckService = inject(DeckService);
  private route = inject(ActivatedRoute);
  private bottomSheet = inject(MatBottomSheet);
  private breakpointObserver = inject(BreakpointObserver);
  private seoService = inject(SeoService);

  readonly selectedTagIds = this.dataService.selectedTagIds;
  readonly decks = computed(() => {
    const selectedTagIds = this.selectedTagIds();
    const decks = this.deckService.filter(selectedTagIds);
    return selectedTagIds.length !== 0 ? decks : decks?.slice(0, 100);
  });
  readonly mobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map(({ matches }) => matches)),
    { initialValue: false },
  );
  readonly hasSelectedTagIds = computed(
    () => this.selectedTagIds().length !== 0,
  );

  constructor() {
    this.themeService.reset();
    this.seoService.reset();

    this.route.paramMap
      .pipe(
        map(params => params.get('tags')),
        takeUntilDestroyed(),
      )
      .subscribe(tags => {
        if (tags) {
          tags.split(',').forEach(tag => this.selectTag(tag));
        }
      });
  }

  openTagsSheet(): void {
    this.bottomSheet.open(TagsSheetComponent);
  }

  private selectTag(tag: string): void {
    this.dataService.tagSelection({ id: tag, selected: true });
  }
}
