import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./chips.scss', './tags.component.css']
})

export class TagsComponent implements OnChanges {
  constructor(private router: Router) { }

  @Input() tags: string[];
  @Input() currentTag: string;
  @ViewChild('tagList') tagList;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tags && changes.tags.previousValue !== changes.tags.currentValue) {
      setTimeout(() => {
        this.initRipples();
      }, 0);
    }
  }

  initRipples(): void {
    const tags = this.tagList.nativeElement.querySelectorAll('.md-chip:not(.mdc-ripple-upgraded)');
    Array.from(tags).forEach(tag => {
      MDCRipple.attachTo(tag);
    });
  }

  goToTag(tag: string): void {
    if (this.currentTag === tag) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', tag]);
    }
  }

  raised(tag: string): boolean {
    return this.currentTag && this.currentTag === tag;
  }
}
