import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { rgb } from '../color';
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
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  constructor(private dataService: DataService,
              private router: Router) {
  }

  currentStyles = {};
  selected = false;

  @Input() tag!: Tag;
  @Input() currentTag!: string;
  @ViewChild('chip') chip!: ElementRef;

  ngOnInit() {
    this.setCurrentStyles();
    fromEvent<ChipSelectionEvent>(this.chip.nativeElement, 'MDCChip:selection')
      .subscribe(this.emitTagSelection.bind(this));
    this.dataService.selectedTagIds$.subscribe(this.setSelection.bind(this));
  }

  private setCurrentStyles(): void {
    this.currentStyles = {
      border: `solid ${rgb(this.tag.primaryColor)} 1px`,
      backgroundColor: rgb({ ...this.tag.primaryColor, a: 0.05 })
    };
  }

  private emitTagSelection(event: ChipSelectionEvent) {
    this.dataService.tagSelection({
      id: event.target.dataset.id,
      selected: event.detail.selected
    });
  }

  private setSelection(selectedTagIds: string[]): void {
    this.selected = selectedTagIds.includes(this.tag.id);
  }
}
