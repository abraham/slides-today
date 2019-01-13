import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { rgb } from '../color';
import { DataService } from '../data.service';
import { Tag } from '../tag';
import { TagsComponent } from '../tags/tags.component';

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
              private router: Router) { }

  currentStyles = {};

  @Input() set!: TagsComponent;
  @Input() @Output() tag!: Tag;
  @Input() currentTag!: string;
  @Input() raised = false;
  @ViewChild('chip') chip!: ElementRef;

  ngOnInit() {
    this.setCurrentStyles();
    fromEvent<ChipSelectionEvent>(this.chip.nativeElement, 'MDCChip:selection')
      .subscribe(this.emitTagSelection.bind(this));
  }

  private setCurrentStyles(): void {
    this.currentStyles = {
      border: `solid ${rgb(this.tag.primaryColor)} 1px`,
      backgroundColor: rgb({ ...this.tag.primaryColor, a: 0.05 })
    };
  }

  updateFilter(_event: MouseEvent, id: string): void {
    const ids = this.set.selectedTags(id);
    // This waits until the chip state has been updated before performing navigation
    requestAnimationFrame(() => {
      if (ids.length === 0) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/tags', { tags: ids }]);
      }
    });
  }

  emitTagSelection(event: ChipSelectionEvent) {
    this.dataService.tagSelection({
      id: event.target.dataset.id,
      selected: event.detail.selected
    });
  }
}
