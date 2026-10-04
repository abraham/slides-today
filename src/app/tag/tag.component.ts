import { Component, computed, inject, input } from '@angular/core';
import { MatChipSelectionChange, MatChipOption } from '@angular/material/chips';
import { Tag } from '../models/tag';
import { DataService } from '../services/data.service';

type ChipStyle = {
  '--mat-chip-with-icon-selected-icon-color': string;
  '--mat-chip-selected-label-text-color': string;
  '--mat-chip-label-text-color': string;
  '--mat-chip-elevated-container-color': string;
  '--mat-chip-elevated-selected-container-color': string;
};

@Component({
  selector: 'app-tag',
  styleUrl: './tag.component.scss',
  templateUrl: './tag.component.html',
  imports: [MatChipOption],
})
export class TagComponent {
  private readonly dataService = inject(DataService);

  readonly tag = input.required<Tag>();

  private readonly selectedTagIds = this.dataService.selectedTagIds;

  readonly selected = computed(() =>
    this.selectedTagIds().includes(this.tag().id),
  );

  readonly currentStyles = computed<ChipStyle>(() => {
    const { complementaryColor, primaryColor } = this.tag();
    return {
      '--mat-chip-label-text-color': complementaryColor,
      '--mat-chip-selected-label-text-color': complementaryColor,
      '--mat-chip-with-icon-selected-icon-color': complementaryColor,
      '--mat-chip-elevated-container-color': primaryColor,
      '--mat-chip-elevated-selected-container-color': primaryColor,
    };
  });

  changeSelected(event: MatChipSelectionChange, tag: Tag): void {
    // Chips also emit when their selected state is bound, which must not navigate.
    if (!event.isUserInput) {
      return;
    }
    const current = this.selectedTagIds();
    const tags = event.selected
      ? [...new Set([...current, tag.id])]
      : current.filter(id => id !== tag.id);
    this.dataService.setFilter('tags', tags);
  }
}
