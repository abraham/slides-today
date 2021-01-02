import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Tag } from '../models/tag';
import { DEFAULT_THEME } from '../models/theme';
import { DataService } from '../services/data.service';

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
export class TagComponent implements OnInit, OnDestroy {
  @Input() tag!: Tag;
  @Input() currentTag!: string;
  @ViewChild('chip', { static: true }) chip!: ElementRef;

  currentStyles = DEFAULT_THEME;
  selected = false;

  private destroy$ = new Subject();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.setCurrentStyles();
    fromEvent<ChipSelectionEvent>(this.chip.nativeElement, 'MDCChip:selection')
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.emitTagSelection.bind(this));
    this.dataService.selectedTagIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.setSelection.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private setCurrentStyles(): void {
    this.currentStyles = {
      backgroundColor: this.tag.primaryColor,
      color: this.tag.complementaryColor,
    };
  }

  private emitTagSelection(event: ChipSelectionEvent): void {
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
