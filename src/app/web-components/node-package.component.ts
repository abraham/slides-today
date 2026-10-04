import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  input,
  signal,
} from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-node-package',
  styleUrl: './web-component.scss',
  imports: [NgxSkeletonLoaderComponent],
  template: `
    @if (!loaded()) {
      <ngx-skeleton-loader
        animation="progress"
        [theme]="{ height: '400px', margin: 0 }" />
    }
    <node-package [attr.name]="name()" />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NodePackageComponent {
  readonly name = input.required<string>();
  protected readonly loaded = signal(false);

  constructor() {
    // Registers the element without blocking the render.
    import('node-package').finally(() => this.loaded.set(true));
  }
}
