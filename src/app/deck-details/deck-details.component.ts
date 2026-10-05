import {
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  ViewContainerRef,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  resource,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { EmbeddedServices } from '../embedded-services';
import { Deck } from '../models/deck';
import { IncludeSiteTitle, SeoService } from '../seo.service';
import { SpeakerService } from '../services/speaker.service';
import { TweetService } from '../services/tweet.service';
import type { ShareComponent } from '../share/share.component';
import { CardComponent } from '../card/card.component';
import { TagChipsComponent } from '../tag-chips/tag-chips.component';
import { EmbedComponent } from '../embed/embed.component';
import { EventComponent } from '../event/event.component';
import { SpeakerComponent } from '../speaker/speaker.component';
import { MapComponent } from '../map/map.component';
import { SponsorComponent } from '../sponsor/sponsor.component';
import { DeckResourcesComponent } from '../deck-resources/deck-resources.component';
import { GithubRepositoryComponent } from '../web-components/github-repository.component';
import { NodePackageComponent } from '../web-components/node-package.component';
import { TwitterStatusComponent } from '../web-components/twitter-status.component';

@Component({
  selector: 'app-deck-details',
  styleUrl: './deck-details.component.scss',
  templateUrl: './deck-details.component.html',
  imports: [
    CardComponent,
    TagChipsComponent,
    EmbedComponent,
    EventComponent,
    SpeakerComponent,
    MapComponent,
    SponsorComponent,
    DeckResourcesComponent,
    GithubRepositoryComponent,
    NodePackageComponent,
    TwitterStatusComponent,
  ],
})
export class DeckDetailsComponent {
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly seoService = inject(SeoService);
  private readonly speakerService = inject(SpeakerService);
  private readonly tweetService = inject(TweetService);
  private share?: ComponentRef<ShareComponent>;
  private shareTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;
  readonly detailsEl = viewChild<ElementRef>('detailsEl');

  readonly deck = input.required<Deck>();
  readonly embeds = computed(() =>
    this.deck().links.filter(({ service }) =>
      Object.keys(EmbeddedServices).includes(service),
    ),
  );
  private readonly tweetsResource = resource({
    params: () => this.deck().tweetIds,
    loader: ({ params, abortSignal }) =>
      this.tweetService.getAll(params, abortSignal),
  });
  // value() throws while the resource is in an error state.
  readonly tweets = computed(
    () =>
      this.tweetService.embedded(this.deck().tweetIds) ??
      (this.tweetsResource.hasValue() ? this.tweetsResource.value() : []),
  );
  private readonly detailsWidth = signal<number | undefined>(undefined);
  readonly embedWidth = computed(() => {
    const width = this.detailsWidth();
    return width !== undefined && width >= 840 ? width / 2 : width;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      clearTimeout(this.shareTimer);
    });

    effect(() => {
      const deck = this.deck();
      untracked(() => this.init(deck));
    });

    // Only runs in the browser, which is the only place that has layout.
    afterRenderEffect(onCleanup => {
      const detailsEl = this.detailsEl();
      if (!detailsEl) {
        return;
      }
      const observer = new ResizeObserver(() =>
        this.detailsWidth.set(
          detailsEl.nativeElement.getBoundingClientRect().width,
        ),
      );
      observer.observe(detailsEl.nativeElement);
      onCleanup(() => observer.disconnect());
    });
  }

  private init(deck: Deck): void {
    this.loadShareComponent(deck);
    // The first speaker's photo is the social card image.
    const [speakerId] = deck.speakerIds;
    this.seoService.update(
      deck.title,
      deck.description,
      IncludeSiteTitle.yes,
      this.speakerService.get(speakerId)?.imageUrl,
    );
  }

  private loadShareComponent(deck: Deck): void {
    if (this.share) {
      this.share.setInput('text', deck.title);
      return;
    }
    // A pending timer reads the latest deck, so later deck changes can skip it.
    this.shareTimer ??= setTimeout(async () => {
      const module = await import('../share/share.component');
      if (this.destroyed) {
        return;
      }
      this.share = this.viewContainer.createComponent(module.ShareComponent);
      this.share.setInput('text', this.deck().title);
    }, 1000);
  }
}
