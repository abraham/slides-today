import { TestBed } from '@angular/core/testing';
import type { Status } from 'twitter-d';

import { TwitterStatusComponent } from './twitter-status.component';

describe('TwitterStatusComponent', () => {
  it('passes the status to the twitter-status element', () => {
    const status = { id_str: '1' } as Status;
    const fixture = TestBed.createComponent(TwitterStatusComponent);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('twitter-status');
    expect(element.status).toBe(status);
  });
});
