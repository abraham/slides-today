import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple';
import { Router } from '@angular/router';

import { Tag } from '../tag';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['../tags/chips.scss', './tag.component.css']
})

export class TagComponent implements OnInit {

  currentStyles = {};

  @Input() tag: Tag;
  @Input() currentTag: string;
  @Input() raised: boolean;
  @ViewChild('tagEL') tagEL;
  constructor(private router: Router) { }

  ngOnInit() {
    this.initRipples();
    this.setCurrentStyles();
  }

  initRipples(): void {
    MDCRipple.attachTo(this.tagEL.nativeElement);
  }

  setCurrentStyles(): void {
    this.currentStyles = {
      backgroundColor: this.tag.backgroundColor,
      color: this.tag.color,
    };
  }

  goToTag(id: string): void {
    if (this.currentTag === id) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', { tag: id}]);
    }
  }
}
