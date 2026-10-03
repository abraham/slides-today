import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
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

  // Comma separated tag ids from the `tags` matrix param, bound by the router.
  readonly tags = input<string>();
  readonly selectedTagIds = this.dataService.selectedTagIds;
  readonly decks = computed(() => {
    const selectedTagIds = this.selectedTagIds();
    const decks = this.deckService.filter(selectedTagIds);
    return selectedTagIds.length !== 0 ? decks : decks?.slice(0, 100);
  });
  readonly mobile = signal(false);
  readonly hasSelectedTagIds = computed(
    () => this.selectedTagIds().length !== 0,
  );

  constructor() {
    this.themeService.reset();
    this.seoService.reset();

    const breakpoints = this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe(({ matches }) => this.mobile.set(matches));
    inject(DestroyRef).onDestroy(() => breakpoints.unsubscribe());

    effect(() => {
      const tags = this.tags();
      if (tags) {
        untracked(() => tags.split(',').forEach(tag => this.selectTag(tag)));
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
