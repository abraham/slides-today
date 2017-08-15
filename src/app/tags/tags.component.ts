import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./chips.scss', './tags.component.css']
})
export class TagsComponent implements OnInit {

  constructor() { }
  @Input() tags: string[];

  ngOnInit() {
  }

}
