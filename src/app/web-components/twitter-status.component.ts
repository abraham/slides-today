import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  computed,
  input,
} from '@angular/core';
import type { Status } from 'twitter-d';
import { loadWhenVisible } from './load-when-visible';

@Component({
  selector: 'app-twitter-status',
  styleUrl: './web-component.scss',
  // The element's shadow root has no slot, so upgrading it hides the fallback child.
  template: `
    <twitter-status [status]="status()">
      <blockquote class="fallback">
        <p>{{ status().full_text }}</p>
        @if (user(); as user) {
          <a [href]="url(user.screen_name)"
            >{{ user.name }} (@{{ user.screen_name }})</a
          >
        }
      </blockquote>
    </twitter-status>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TwitterStatusComponent {
  readonly status = input.required<Status>();
  // Statuses always carry a full user, but the type also allows a trimmed one.
  protected readonly user = computed(() => {
    const { user } = this.status();
    return 'screen_name' in user ? user : undefined;
  });

  protected url(screenName: string): string {
    return `https://twitter.com/${screenName}/status/${this.status().id_str}`;
  }

  constructor() {
    // The element needs a browser, and registers without blocking the render.
    loadWhenVisible(() => import('twitter-status'));
  }
}
