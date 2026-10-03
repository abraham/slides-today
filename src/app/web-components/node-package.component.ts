import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core';

@Component({
  selector: 'app-node-package',
  styleUrl: './web-component.scss',
  template: `<node-package [attr.name]="name()" />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NodePackageComponent {
  readonly name = input.required<string>();
}
