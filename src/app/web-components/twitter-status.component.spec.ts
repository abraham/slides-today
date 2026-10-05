import { TestBed } from '@angular/core/testing';
import type { Status } from 'twitter-d';

import { TwitterStatusComponent } from './twitter-status.component';

const loaded = vi.hoisted(() => vi.fn());

const status = {
  id_str: '1',
  full_text: 'Hello web components',
  user: { name: 'Pearl Latteier', screen_name: 'pblatteier' },
} as Status;

vi.mock('twitter-status', () => {
  loaded();
  return {};
});

describe('TwitterStatusComponent', () => {
  it('loads the twitter-status element', async () => {
    const fixture = TestBed.createComponent(TwitterStatusComponent);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
    await vi.dynamicImportSettled();

    expect(loaded).toHaveBeenCalled();
  });

  it('passes the status to the twitter-status element', () => {
    const fixture = TestBed.createComponent(TwitterStatusComponent);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('twitter-status');
    expect(element.status).toBe(status);
  });

  it('renders the tweet text and a link inside the element for pages without JavaScript', () => {
    const fixture = TestBed.createComponent(TwitterStatusComponent);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector(
      'twitter-status > blockquote',
    );
    expect(fallback.querySelector('p').textContent).toBe(
      'Hello web components',
    );
    expect(fallback.querySelector('a').getAttribute('href')).toBe(
      'https://twitter.com/pblatteier/status/1',
    );
    expect(fallback.querySelector('a').textContent).toBe(
      'Pearl Latteier (@pblatteier)',
    );
  });
});
