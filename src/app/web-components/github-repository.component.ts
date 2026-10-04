import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  afterNextRender,
  input,
  signal,
} from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-github-repository',
  styleUrl: './web-component.scss',
  imports: [NgxSkeletonLoaderComponent],
  template: `
    @if (!loaded()) {
      <ngx-skeleton-loader
        animation="progress"
        [theme]="{ height: '400px', margin: 0 }" />
    }
    <github-repository [attr.owner-repo]="ownerRepo()" />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GithubRepositoryComponent {
  readonly ownerRepo = input.required<string>();
  protected readonly loaded = signal(false);

  constructor() {
    // The element needs a browser, and registers without blocking the render.
    afterNextRender(() =>
      import('github-repository').finally(() => this.loaded.set(true)),
    );
  }
}
