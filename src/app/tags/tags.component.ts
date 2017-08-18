import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./chips.scss', './tags.component.css']
})

export class TagsComponent {
  constructor() { }

  @Input() tags: string[];
  @Input() currentTag: string;

  raised(tag: string): boolean {
    return this.currentTag && this.currentTag === tag;
  }
}
