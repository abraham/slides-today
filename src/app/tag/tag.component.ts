import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { MatChipSelectionChange, MatChipOption } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tag } from '../models/tag';
import { DEFAULT_THEME } from '../models/theme';
import { DataService } from '../services/data.service';
import { NgStyle } from '@angular/common';

type ChipStyle = {
  '--mat-chip-with-icon-selected-icon-color': string;
  '--mat-chip-selected-label-text-color': string;
  '--mat-chip-label-text-color': string;
  '--mat-chip-elevated-container-color': string;
  '--mat-chip-elevated-selected-container-color': string;
};

@Component({
  selector: 'app-tag',
  styleUrls: ['./tag.component.scss'],
  templateUrl: './tag.component.html',
  imports: [MatChipOption, NgStyle],
})
export class TagComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);

  @Input() tag!: Tag;
  @Input() currentTag!: string;

  currentStyles: ChipStyle = {
    '--mat-chip-with-icon-selected-icon-color': DEFAULT_THEME.color,
    '--mat-chip-selected-label-text-color': DEFAULT_THEME.color,
    '--mat-chip-label-text-color': DEFAULT_THEME.color,
    '--mat-chip-elevated-container-color': DEFAULT_THEME.backgroundColor,
    '--mat-chip-elevated-selected-container-color':
      DEFAULT_THEME.backgroundColor,
  };
  selected = false;

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.setCurrentStyles();
    this.dataService.selectedTagIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.setSelection.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  changeSelected(event: MatChipSelectionChange, tag: Tag): void {
    this.dataService.tagSelection({
      id: tag.id,
      selected: event.selected,
      updatePath: true,
    });
  }

  private setCurrentStyles(): void {
    this.currentStyles = {
      '--mat-chip-label-text-color': this.tag.complementaryColor,
      '--mat-chip-selected-label-text-color': this.tag.complementaryColor,
      '--mat-chip-with-icon-selected-icon-color': this.tag.complementaryColor,
      '--mat-chip-elevated-container-color': this.tag.primaryColor,
      '--mat-chip-elevated-selected-container-color': this.tag.primaryColor,
    };
  }

  private setSelection(selectedTagIds: string[]): void {
    this.selected = selectedTagIds.includes(this.tag.id);
  }
}
