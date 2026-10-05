import { Component, TransferState, input, makeStateKey } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title } from '@angular/platform-browser';
import type { Status } from 'twitter-d';
import Data from '../decks.data.json';
import { Deck } from '../models/deck';
import { DEFAULT_IMAGE } from '../seo.service';
import speakers from '../speakers.data.json';
import { SpeakerService } from '../services/speaker.service';
import { SponsorService } from '../services/sponsor.service';
import { createDeck } from '../testing';
import { GithubRepositoryComponent } from '../web-components/github-repository.component';
import { NodePackageComponent } from '../web-components/node-package.component';
import { TwitterStatusComponent } from '../web-components/twitter-status.component';

import { DeckDetailsComponent } from './deck-details.component';
import { environment } from '../../environments/environment';

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

  beforeEach(async () => {
    await TestBed.inject(SpeakerService).loaded;
    await TestBed.inject(SponsorService).loaded;
    fixture = TestBed.createComponent(DeckDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('deck', createDeck(Data[0]));
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

  it('keeps the full embed width when the column is narrow', () => {
    const details: HTMLElement = fixture.nativeElement.querySelector('.item');
    vi.spyOn(details, 'getBoundingClientRect').mockReturnValue({
      width: 600,
    } as DOMRect);
    resizeCallback();
    expect(component.embedWidth()).toEqual(600);
  });

  describe('content', () => {
    const find = (predicate: (deck: (typeof Data)[number]) => boolean): Deck =>
      createDeck(Data.find(deck => !deck.archived && predicate(deck))!);
    const show = (deck: Deck): void => {
      fixture.componentRef.setInput('deck', deck);
      fixture.detectChanges();
    };
    const count = (selector: string): number =>
      fixture.nativeElement.querySelectorAll(selector).length;

    // Tweets are covered separately; keep them from fetching here.
    beforeEach(() =>
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => ({ ok: false, status: 404 })),
      ),
    );

    it('shows the title, event and description of the deck', () => {
      const deck = find(() => true);
      show(deck);

      const text: string = fixture.nativeElement.textContent;
      expect(text).toContain(deck.title);
      expect(text).toContain(deck.eventTitle);
      expect(text).toContain(deck.description);
    });

    it('sets the page title and description from the deck', () => {
      const deck = find(() => true);
      show(deck);

      expect(TestBed.inject(Title).getTitle()).toBe(
        `${deck.title} | Slides.today`,
      );
    });

    it('uses the first speaker photo as the social image', () => {
      const deck = find(raw => raw.speakerIds.length > 0);
      show(deck);

      const image = document.head
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content');
      const speaker = speakers.find(({ id }) => id === deck.speakerIds[0])!;
      expect(image).toBe(new URL(speaker.imageUrl, environment.siteUrl).href);
    });

    it('uses the default social image for a deck without speakers', () => {
      show(createDeck({ ...Data[0]!, speakerIds: [] }));

      const image = document.head
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content');
      expect(image).toBe(new URL(DEFAULT_IMAGE, environment.siteUrl).href);
    });

    it('shows a card for each event between the speakers and the map', () => {
      const deck = find(
        raw => raw.events.length > 1 && raw.speakerIds.length > 0,
      );
      show(deck);

      expect(count('app-event')).toBe(deck.occurrences.length);
      const speaker: HTMLElement =
        fixture.nativeElement.querySelector('app-speaker');
      const event: HTMLElement =
        fixture.nativeElement.querySelector('app-event');
      const map: HTMLElement = fixture.nativeElement.querySelector('app-map');
      expect(
        speaker.compareDocumentPosition(event) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(
        event.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('shows a card for each speaker', () => {
      const deck = find(raw => raw.speakerIds.length > 1);
      show(deck);

      expect(count('app-speaker')).toBe(deck.speakerIds.length);
    });

    it('shows the map for the location', () => {
      show(find(() => true));

      expect(count('app-map')).toBe(1);
    });

    it('shows sponsors only when the deck has sponsors', () => {
      show(find(raw => raw.sponsorIds.length > 0));
      expect(count('app-sponsor')).toBe(1);

      show(find(raw => raw.sponsorIds.length === 0));
      expect(count('app-sponsor')).toBe(0);
    });

    it('shows resources only when the deck has resources', () => {
      show(find(raw => raw.resources.length > 0));
      expect(count('app-deck-resources')).toBe(1);

      show(find(raw => raw.resources.length === 0));
      expect(count('app-deck-resources')).toBe(0);
    });

    it('shows a card for each GitHub repo and npm package', () => {
      const deck = find(
        raw => raw.githubRepos.length > 0 && raw.nodePackages.length > 0,
      );
      show(deck);

      expect(count('app-github-repository')).toBe(deck.githubRepos.length);
      expect(count('app-node-package')).toBe(deck.nodePackages.length);
    });

    it('shows an embed for each embeddable link', () => {
      const deck = find(raw =>
        raw.links.some(link =>
          ['slides', 'vimeo', 'youtube'].includes(link.service),
        ),
      );
      show(deck);

      const embeddable = deck.links.filter(link =>
        ['slides', 'vimeo', 'youtube'].includes(link.service),
      );
      expect(count('app-embed')).toBe(embeddable.length);
    });
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
      fixture.componentRef.setInput('deck', createDeck(Data[3]));
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(1000);
      await vi.dynamicImportSettled();
      fixture.componentRef.setInput('deck', createDeck(Data[5]));
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
      return createDeck(raw);
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

    it('renders statuses embedded in the page on the first pass', () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      const deck = deckWithTweets();
      const state = TestBed.inject(TransferState);
      deck.tweetIds.forEach(id =>
        state.set(makeStateKey<Status>(`status:${id}`), {
          id_str: id,
        } as Status),
      );

      fixture.componentRef.setInput('deck', deck);
      fixture.detectChanges();

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
