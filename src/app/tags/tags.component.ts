import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MDCChip, MDCChipSet } from '@material/chips/index';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { Tag } from '../tag';

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
})
export class TagsComponent implements OnInit, AfterViewInit {
  constructor(private dataService: DataService) {
    this.tags$ = this.dataService.tags$;
  }

  tags$: Observable<Tag[]>;

  private chipSet!: ChipSet;

  @Input() currentTags: string[] = [];
  @ViewChild('tagsEl') tagsEl!: ElementRef;

  ngOnInit() {
    this.tags$ = this.dataService.filterTags$(this.currentTags);
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.chipSet = MDCChipSet.attachTo(this.tagsEl.nativeElement) as ChipSet;
    });
  }
}
