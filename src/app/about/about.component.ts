import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  imageUrl = '/assets/img/about-medium.jpg';

  ngOnInit() {
  }

  openTwitter(handle: string): void {
    window.open(`https://twitter.com/${handle}`);
  }

  open(url: string): void {
    window.open(url);
  }

}
