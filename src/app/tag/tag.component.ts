import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { rgb } from '../color';
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

  private setCurrentStyles(): void {
    this.currentStyles = {
      border: `solid ${rgb(this.tag.primaryColor)} 1px`,
      backgroundColor: rgb({ ...this.tag.primaryColor, a: 0.05 })
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
