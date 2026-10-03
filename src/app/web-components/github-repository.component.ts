import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core';

@Component({
  selector: 'app-github-repository',
  styleUrl: './web-component.scss',
  template: `<github-repository [attr.owner-repo]="ownerRepo()" />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GithubRepositoryComponent {
  readonly ownerRepo = input.required<string>();

  constructor() {
    // Registers the element without blocking the render.
    import('github-repository');
  }
}
