import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SeoService } from '../seo.service';
import { DataService } from '../services/data.service';
import { DeckService } from '../services/deck.service';
import { SpeakerService } from '../services/speaker.service';
import { ThemeService } from '../services/theme.service';
import { FiltersSheetComponent } from '../filters-sheet/filters-sheet.component';
import { TagChipsComponent } from '../tag-chips/tag-chips.component';
import { SpeakerChipsComponent } from '../speaker-chips/speaker-chips.component';
import { EventChipsComponent } from '../event-chips/event-chips.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AboutComponent } from '../about/about.component';
import { DeckSummaryComponent } from '../deck-summary/deck-summary.component';
import { formatList } from '../models/text';
import { findEventTitle } from '../models/event';

@Component({
  selector: 'app-deck-list',
  styleUrl: './deck-list.component.scss',
  templateUrl: './deck-list.component.html',
  imports: [
    TagChipsComponent,
    SpeakerChipsComponent,
    EventChipsComponent,
    MatButton,
    MatIcon,
    AboutComponent,
    DeckSummaryComponent,
  ],
})
export class DeckListComponent {
  private readonly dataService = inject(DataService);
  private readonly themeService = inject(ThemeService);
  private readonly deckService = inject(DeckService);
  private readonly speakerService = inject(SpeakerService);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly seoService = inject(SeoService);

  readonly selectedTagIds = this.dataService.selectedTagIds;
  readonly selectedSpeakerIds = this.dataService.selectedSpeakerIds;
  readonly selectedEventIds = this.dataService.selectedEventIds;
  readonly hasSelectedFilters = computed(
    () =>
      this.selectedTagIds().length !== 0 ||
      this.selectedSpeakerIds().length !== 0 ||
      this.selectedEventIds().length !== 0,
  );
  readonly selectedFilters = computed(() =>
    formatList([
      ...this.selectedTagIds().map(id => `#${id}`),
      ...this.selectedSpeakerIds().map(
        id => this.speakerService.get(id)?.name ?? id,
      ),
      ...this.selectedEventIds().map(id => findEventTitle(id) ?? id),
    ]),
  );
  readonly decks = computed(() => {
    const decks = this.deckService.filter(
      this.selectedTagIds(),
      this.selectedSpeakerIds(),
      this.selectedEventIds(),
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

  openFiltersSheet(): void {
    this.bottomSheet.open(FiltersSheetComponent);
  }
}
