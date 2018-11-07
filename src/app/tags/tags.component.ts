import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MDCChip, MDCChipSet } from '@material/chips/index';
import { Tag } from '../tag';
import { DataService } from '../data.service';

type ChipSet = MDCChipSet & {
  chips: Chip[];
};

type Chip = MDCChip & {
  root_: HTMLDivElement;
  selected: boolean;
};

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  providers: [DataService],
})

export class TagsComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(private dataService: DataService) { }

  tags: Promise<Tag[]> = Promise.resolve([]);
  private chipSet!: ChipSet;

  @Input() currentTags: string[] = [];
  @Input() tagIds: string[] = [];
  @ViewChild('tagsEl') tagsEl!: ElementRef;

  ngOnInit() {
    this.tagIds = this.tagIds || [];
    if (this.tagIds && this.tagIds.length === 0) {
      this.tags = this.dataService.tags$.toPromise();
    } else {
      this.tags = this.dataService.filterTags$(this.tagIds).toPromise();
    }
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.chipSet = MDCChipSet.attachTo(this.tagsEl.nativeElement) as ChipSet;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tagIds && changes.tagIds.currentValue) {
      this.tags = this.dataService.filterTags$(this.tagIds).toPromise();
    }
  }

  selectedTags(activatedId: string): string[] {
    const ids: string[] = (this.chipSet as ChipSet).chips
      .filter((chip: Chip) => chip.selected)
      .map((chip: Chip) => chip.root_.dataset.id as string);

    if (ids.includes(activatedId)) {
      return ids.filter(id => id !== activatedId);
    } else {
      return ids.concat(activatedId);
    }
  }

  isRaised(id: string): boolean {
    return this.currentTags.includes(id);
  }
}
