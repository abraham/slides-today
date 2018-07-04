import { AfterViewInit, Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MDCChip, MDCChipSet } from '@material/chips';

import { Tag } from '../tag';
import { TagService } from '../tag.service';

type ChipSet = MDCChipSet & {
  chips: MDCChip[];
};

type Chip = MDCChip & {
  root_: HTMLDivElement;
};

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  providers: [TagService],
})

export class TagsComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(private tagService: TagService) { }

  tags: Promise<Tag[]>;
  private chipSet: MDCChipSet;

  @Input() currentTags: string[] = [];
  @Input() tagIds: string[] = [];
  @ViewChild('tagsEl') tagsEl;

  ngOnInit() {
    this.tagIds = this.tagIds || [];
    if (this.tagIds && this.tagIds.length === 0) {
      this.tags = this.tagService.getTags();
    } else {
      this.tags = this.tagService.filterTags(this.tagIds);
    }
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.chipSet = MDCChipSet.attachTo(this.tagsEl.nativeElement);
    });
  }

  ngOnChanges(changes) {
    if (changes.tagIds && changes.tagIds.currentValue) {
      this.tags = this.tagService.filterTags(this.tagIds);
    }
  }

  selectedTags(activatedId: string): string[] {
    const ids: string[] = (this.chipSet as ChipSet).chips
      .filter((chip: Chip) => chip.isSelected())
      .map((chip: Chip) => chip.root_.dataset.id);

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
