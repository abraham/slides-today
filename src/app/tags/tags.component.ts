import { Component, Input, OnInit } from '@angular/core';

import { TagService } from '../tag.service';
import { Tag } from '../tag';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  providers: [TagService],
})

export class TagsComponent implements OnInit {
  constructor(private tagService: TagService) { }

  tagData: Tag[];

  @Input() tags: string[];
  @Input() currentTag: string;

  ngOnInit() {
    this.tagService.getTags().then(tags => this.tagData = tags);
  }

  raised(tag: string): boolean {
    return this.currentTag && this.currentTag === tag;
  }

  getTag(id: string): Tag {
    return this.tagData.find(tag => tag.id === id);
  }
}
