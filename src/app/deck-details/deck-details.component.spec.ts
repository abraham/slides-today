import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Status } from 'twitter-d';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';
import { GithubRepositoryComponent } from '../web-components/github-repository.component';
import { NodePackageComponent } from '../web-components/node-package.component';
import { TwitterStatusComponent } from '../web-components/twitter-status.component';

import { DeckDetailsComponent } from './deck-details.component';

// The real elements fetch data and need full API payloads, so the page is tested with stubs.
@Component({ selector: 'app-github-repository', template: '' })
class GithubRepositoryStubComponent {
  readonly ownerRepo = input.required<string>();
}

@Component({ selector: 'app-node-package', template: '' })
class NodePackageStubComponent {
  readonly name = input.required<string>();
}

@Component({ selector: 'app-twitter-status', template: '' })
class TwitterStatusStubComponent {
  readonly status = input.required<Status>();
}

vi.mock('@justinribeiro/lite-youtube', () => ({}));

describe('DeckDetailsComponent', () => {
  let component: DeckDetailsComponent;
  let fixture: ComponentFixture<DeckDetailsComponent>;
  let resizeCallback: () => void;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resizeCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    await TestBed.configureTestingModule({
      imports: [DeckDetailsComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(DeckDetailsComponent, {
        remove: {
          imports: [
            GithubRepositoryComponent,
            NodePackageComponent,
            TwitterStatusComponent,
          ],
        },
        add: {
          imports: [
            GithubRepositoryStubComponent,
            NodePackageStubComponent,
            TwitterStatusStubComponent,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('deck', new Deck(Data[0]));
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('halves the embed width when the column is wide', () => {
    const details: HTMLElement = fixture.nativeElement.querySelector('.item');
    vi.spyOn(details, 'getBoundingClientRect').mockReturnValue({
      width: 1000,
    } as DOMRect);
    resizeCallback();
    expect(component.embedWidth()).toEqual(500);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('share component', () => {
    // Created siblings of the test root can outlive their fixture in document.body.
    let baseline: number;
    const shareCount = (): number =>
      document.body.querySelectorAll('app-share').length - baseline;

    beforeEach(() => {
      baseline = document.body.querySelectorAll('app-share').length;
    });

    it('is created once even when the deck changes', async () => {
      fixture.componentRef.setInput('deck', new Deck(Data[3]));
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.dynamicImportSettled();
      fixture.componentRef.setInput('deck', new Deck(Data[5]));
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.dynamicImportSettled();

      expect(shareCount()).toBe(1);
    });

    it('is not created after the component is destroyed', async () => {
      fixture.destroy();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.dynamicImportSettled();

      expect(shareCount()).toBe(0);
    });
  });

  describe('tweets', () => {
    const deckWithTweets = (): Deck => {
      const raw = Data.find(deck => deck.tweetIds.length === 2)!;
      return new Deck(raw);
    };
    const statusCount = (): number =>
      fixture.nativeElement.querySelectorAll('app-twitter-status').length;
    // whenStable never resolves under fake timers.
    const settle = async (): Promise<void> => {
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();
    };

    it('loads and renders a status for each tweet id', async () => {
      const fetchMock = vi.fn(async (url: string) => ({
        ok: true,
        json: async () => ({ id_str: url }),
      }));
      vi.stubGlobal('fetch', fetchMock);
      const deck = deckWithTweets();

      fixture.componentRef.setInput('deck', deck);
      await settle();

      expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(
        deck.tweetIds.map(id => `/assets/statuses/${id}.json`),
      );
      expect(statusCount()).toBe(2);
    });

    it('renders no statuses when a status fails to load', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => ({ ok: false, status: 404 })),
      );

      fixture.componentRef.setInput('deck', deckWithTweets());
      await settle();

      expect(statusCount()).toBe(0);
    });
  });
});
