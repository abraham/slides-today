import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  @Input() text = 'Page Not Found';
}
