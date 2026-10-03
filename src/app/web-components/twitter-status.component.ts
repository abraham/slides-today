import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core';
import type { Status } from 'twitter-d';

@Component({
  selector: 'app-twitter-status',
  styleUrl: './web-component.scss',
  template: `<twitter-status [status]="status()" />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TwitterStatusComponent {
  readonly status = input.required<Status>();
}
