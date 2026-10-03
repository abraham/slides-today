import { Component, computed, inject, input } from '@angular/core';
import { MatChipSelectionChange, MatChipOption } from '@angular/material/chips';
import { Router } from '@angular/router';
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
  private dataService = inject(DataService);
  private router = inject(Router);

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
    this.dataService.tagSelection({
      id: tag.id,
      selected: event.selected,
    });
    const tags = this.selectedTagIds();
    if (tags.length === 0) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', { tags }]);
    }
  }
}
