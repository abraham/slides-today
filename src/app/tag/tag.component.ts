import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tag } from '../models/tag';
import { DEFAULT_THEME } from '../models/theme';
import { DataService } from '../services/data.service';

type ChipStyle = {
  '--mdc-chip-with-icon-selected-icon-color': string;
  '--mdc-chip-selected-label-text-color': string;
  '--mdc-chip-label-text-color': string;
  '--mdc-chip-elevated-container-color': string;
  '--mdc-chip-elevated-selected-container-color': string;
};

@Component({
  selector: 'app-tag',
  styleUrls: ['./tag.component.scss'],
  templateUrl: './tag.component.html',
  standalone: false,
})
export class TagComponent implements OnInit, OnDestroy {
  @Input() tag!: Tag;
  @Input() currentTag!: string;

  currentStyles: ChipStyle = {
    '--mdc-chip-with-icon-selected-icon-color': DEFAULT_THEME.color,
    '--mdc-chip-selected-label-text-color': DEFAULT_THEME.color,
    '--mdc-chip-label-text-color': DEFAULT_THEME.color,
    '--mdc-chip-elevated-container-color': DEFAULT_THEME.backgroundColor,
    '--mdc-chip-elevated-selected-container-color':
      DEFAULT_THEME.backgroundColor,
  };
  selected = false;

  private destroy$ = new Subject();

  constructor(private dataService: DataService) {}

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
      '--mdc-chip-label-text-color': this.tag.complementaryColor,
      '--mdc-chip-selected-label-text-color': this.tag.complementaryColor,
      '--mdc-chip-with-icon-selected-icon-color': this.tag.complementaryColor,
      '--mdc-chip-elevated-container-color': this.tag.primaryColor,
      '--mdc-chip-elevated-selected-container-color': this.tag.primaryColor,
    };
  }

  private setSelection(selectedTagIds: string[]): void {
    this.selected = selectedTagIds.includes(this.tag.id);
  }
}
