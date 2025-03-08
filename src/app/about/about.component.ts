import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  styleUrls: ['./about.component.scss'],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  links = [
    {
      title: '@abraham',
      url: 'https://twitter.com/abraham',
    },
    {
      title: '@pblatteier',
      url: 'https://twitter.com/pblatteier',
    },
  ];

  imageUrl = '/assets/img/about-medium.jpg';
}
