import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  input,
  signal,
} from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import type { Status } from 'twitter-d';

@Component({
  selector: 'app-twitter-status',
  styleUrl: './web-component.scss',
  imports: [NgxSkeletonLoaderComponent],
  template: `
    @if (!loaded()) {
      <ngx-skeleton-loader
        animation="progress"
        [theme]="{ height: '400px', margin: 0 }" />
    }
    <twitter-status [status]="status()" />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TwitterStatusComponent {
  readonly status = input.required<Status>();
  protected readonly loaded = signal(false);

  constructor() {
    // Registers the element without blocking the render.
    import('twitter-status').finally(() => this.loaded.set(true));
  }
}
