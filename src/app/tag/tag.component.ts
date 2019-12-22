import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { DEFAULT_THEME, rgb, Theme } from '../color';
import { DataService } from '../data.service';
import { Tag } from '../tag';

interface ChipSelectionEvent extends CustomEvent {
  detail: {
    chipId: string;
    selected: boolean;
  };
  target: HTMLDivElement & {
    dataset: {
      id: string;
    };
  };
}

@Component({
  selector: 'app-tag',
  styleUrls: ['./tag.component.scss'],
  templateUrl: './tag.component.html',
})
export class TagComponent implements OnInit {
  constructor(private dataService: DataService) {}

  currentStyles: Theme = DEFAULT_THEME;
  selected = false;

  @Input() tag!: Tag;
  @Input() currentTag!: string;
  @ViewChild('chip', { static: true }) chip!: ElementRef;

  ngOnInit() {
    this.setCurrentStyles();
    fromEvent<ChipSelectionEvent>(this.chip.nativeElement, 'MDCChip:selection')
      .subscribe(this.emitTagSelection.bind(this));
    this.dataService.selectedTagIds$.subscribe(this.setSelection.bind(this));
  }

  private setCurrentStyles(): void {
    this.currentStyles = {
      backgroundColor: rgb(this.tag.primaryColor),
      color: rgb(this.tag.complementaryColor),
    };
  }

  private emitTagSelection(event: ChipSelectionEvent) {
    this.dataService.tagSelection({
      id: event.target.dataset.id,
      selected: event.detail.selected,
      updatePath: true,
    });
  }

  private setSelection(selectedTagIds: string[]): void {
    this.selected = selectedTagIds.includes(this.tag.id);
  }
}
