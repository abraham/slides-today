import { TestBed } from '@angular/core/testing';

import { GithubRepositoryComponent } from './github-repository.component';

describe('GithubRepositoryComponent', () => {
  it('passes the repo to the github-repository element', () => {
    const fixture = TestBed.createComponent(GithubRepositoryComponent);
    fixture.componentRef.setInput('ownerRepo', 'abraham/slides-today');
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('github-repository');
    expect(element.getAttribute('owner-repo')).toBe('abraham/slides-today');
  });
});
