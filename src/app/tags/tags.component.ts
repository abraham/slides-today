import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./chips.scss', './tags.component.css']
})

export class TagsComponent implements OnInit {
  constructor(private router: Router) { }

  @Input() tags: string[];
  @Input() currentTag: string;

  ngOnInit() { }

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
