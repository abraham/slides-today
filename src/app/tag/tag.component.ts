import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['../tags/chips.scss', './tag.component.css']
})

export class TagComponent implements OnInit {

  @Input() text: string;
  @Input() currentTag: string;
  @Input() raised: boolean;
  @ViewChild('tag') tag;

  constructor(private router: Router) { }

  ngOnInit() {
    this.initRipples();
  }

  initRipples(): void {
    MDCRipple.attachTo(this.tag.nativeElement);
  }

  goToTag(tag: string): void {
    if (this.currentTag === tag) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/tags', tag]);
    }
  }
}
