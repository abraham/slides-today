import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MDCChipSet } from '@material/chips';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { Tag } from '../tag';

@Component({
  selector: 'app-tags',
  styleUrls: ['./tags.component.scss'],
  templateUrl: './tags.component.html',
})
export class TagsComponent implements OnInit, AfterViewInit {
  constructor(private dataService: DataService) {
    this.tags$ = this.dataService.tags$;
  }

  tags$: Observable<Tag[]>;

  private chipSet!: MDCChipSet;

  @Input() currentTags: string[] = [];
  @ViewChild('tagsEl', { static: true }) tagsEl!: ElementRef;

  ngOnInit() {
    this.tags$ = this.dataService.filterTags$(this.currentTags);
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      this.chipSet = MDCChipSet.attachTo(this.tagsEl.nativeElement);
    });
  }
}
