import { Component, computed, inject, input } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatIconButton } from '@angular/material/button';
import { MatChipListbox } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tag-chips',
  styleUrl: './tag-chips.component.scss',
  templateUrl: './tag-chips.component.html',
  imports: [MatChipListbox, MatIcon, MatIconButton, TagComponent],
})
export class TagChipsComponent {
  private readonly dataService = inject(DataService);

  readonly currentTags = input<string[]>([]);

  readonly tags = computed(() =>
    this.dataService.filterTags(this.currentTags()),
  );

  // Only the filter list offers clearing; a deck's own tags are fixed.
  readonly canClear = computed(
    () =>
      this.currentTags().length === 0 &&
      this.dataService.selectedTagIds().length !== 0,
  );

  clear(): void {
    this.dataService.setFilter('tags', []);
  }
}
