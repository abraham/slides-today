import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MDCChipSet } from '@material/chips';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { DataService } from '../services/data.service';

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

  @Input() currentTags: string[] = [];
  @ViewChild('tagsEl', { static: true }) tagsEl!: ElementRef;

  ngOnInit() {
    this.tags$ = this.dataService.filterTags$(this.currentTags);
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      MDCChipSet.attachTo(this.tagsEl.nativeElement);
    });
  }
}
