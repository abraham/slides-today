import { TestBed } from '@angular/core/testing';

import { NodePackageComponent } from './node-package.component';

const loaded = vi.hoisted(() => vi.fn());

vi.mock('node-package', () => {
  loaded();
  return {};
});

describe('NodePackageComponent', () => {
  it('loads the node-package element', async () => {
    const fixture = TestBed.createComponent(NodePackageComponent);
    fixture.componentRef.setInput('name', 'ngx-skeleton-loader');
    await vi.dynamicImportSettled();

    expect(loaded).toHaveBeenCalled();
  });

  it('passes the package name to the node-package element', () => {
    const fixture = TestBed.createComponent(NodePackageComponent);
    fixture.componentRef.setInput('name', 'ngx-skeleton-loader');
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('node-package');
    expect(element.getAttribute('name')).toBe('ngx-skeleton-loader');
  });
});
