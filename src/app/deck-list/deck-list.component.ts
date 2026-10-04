import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
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
  styleUrl: './deck-list.component.scss',
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
  private readonly dataService = inject(DataService);
  private readonly themeService = inject(ThemeService);
  private readonly deckService = inject(DeckService);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly seoService = inject(SeoService);

  readonly selectedTagIds = this.dataService.selectedTagIds;
  readonly selectedSpeakerIds = this.dataService.selectedSpeakerIds;
  readonly hasSelectedFilters = computed(
    () =>
      this.selectedTagIds().length !== 0 ||
      this.selectedSpeakerIds().length !== 0,
  );
  readonly decks = computed(() => {
    const decks = this.deckService.filter(
      this.selectedTagIds(),
      this.selectedSpeakerIds(),
    );
    return this.hasSelectedFilters() ? decks : decks?.slice(0, 100);
  });
  readonly mobile = signal(false);

  constructor() {
    this.themeService.reset();
    this.seoService.reset();

    const breakpoints = this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe(({ matches }) => this.mobile.set(matches));
    inject(DestroyRef).onDestroy(() => breakpoints.unsubscribe());
  }

  openTagsSheet(): void {
    this.bottomSheet.open(TagsSheetComponent);
  }
}
