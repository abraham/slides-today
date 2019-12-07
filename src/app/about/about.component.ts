import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent {

  links = [
    {
      url: 'https://twitter.com/abraham',
      title: '@abraham',
    },
    {
      url: 'https://twitter.com/pblatteier',
      title: '@pblatteier',
    },
  ];

  constructor() { }

  imageUrl = '/assets/img/about-medium.jpg';
}
