import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Tag } from '../tag';
import { TagsComponent } from '../tags/tags.component';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})

export class TagComponent implements OnInit {

  currentStyles = {};

  @Input() set!: TagsComponent;
  @Input() @Output() tag!: Tag;
  @Input() currentTag!: string;
  @Input() raised = false;
  @ViewChild('tagEl') tagEl?: ElementRef;
  constructor(private router: Router) { }

  ngOnInit() {
    this.setCurrentStyles();
  }

  setCurrentStyles(): void {
    this.currentStyles = {
      backgroundColor: this.tag.backgroundColor,
      color: this.tag.color,
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
}
