import { TestBed } from '@angular/core/testing';
import type { Status } from 'twitter-d';

import { TwitterStatusComponent } from './twitter-status.component';

const loaded = vi.hoisted(() => vi.fn());

vi.mock('twitter-status', () => {
  loaded();
  return {};
});

describe('TwitterStatusComponent', () => {
  it('loads the twitter-status element', async () => {
    const fixture = TestBed.createComponent(TwitterStatusComponent);
    fixture.componentRef.setInput('status', { id_str: '1' } as Status);
    fixture.detectChanges();
    await vi.dynamicImportSettled();

    expect(loaded).toHaveBeenCalled();
  });

  it('passes the status to the twitter-status element', () => {
    const status = { id_str: '1' } as Status;
    const fixture = TestBed.createComponent(TwitterStatusComponent);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('twitter-status');
    expect(element.status).toBe(status);
  });
});
