import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tags',
  styleUrls: ['./tags.component.scss'],
  templateUrl: './tags.component.html',
  standalone: false,
})
export class TagsComponent implements OnInit {
  @Input() currentTags: string[] = [];
  @ViewChild('tagsEl', { static: true }) tagsEl!: ElementRef;

  tags$: Observable<Tag[]>;

  constructor(private dataService: DataService) {
    this.tags$ = this.dataService.tags$;
  }

  ngOnInit(): void {
    this.tags$ = this.dataService.filterTags$(this.currentTags);
  }
}
