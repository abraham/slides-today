import { Location } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  resource,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { EmbeddedServices } from '../embedded-services';
import { Deck } from '../models/deck';
import { SeoService } from '../seo.service';
import { TweetService } from '../services/tweet.service';
import type { ShareComponent } from '../share/share.component';
import { CardComponent } from '../card/card.component';
import { TagsComponent } from '../tags/tags.component';
import { EmbedComponent } from '../embed/embed.component';
import { SpeakerComponent } from '../speaker/speaker.component';
import { MapComponent } from '../map/map.component';
import { SponsorComponent } from '../sponsor/sponsor.component';
import { DeckResourcesComponent } from '../deck-resources/deck-resources.component';

@Component({
  selector: 'app-deck-details',
  styleUrls: ['./deck-details.component.scss'],
  templateUrl: './deck-details.component.html',
  imports: [
    CardComponent,
    TagsComponent,
    EmbedComponent,
    SpeakerComponent,
    MapComponent,
    SponsorComponent,
    DeckResourcesComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DeckDetailsComponent {
  private location = inject(Location);
  private router = inject(Router);
  private viewContainer = inject(ViewContainerRef);
  private seoService = inject(SeoService);
  private tweetService = inject(TweetService);
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
  readonly tweets = computed(() =>
    this.tweetsResource.hasValue() ? this.tweetsResource.value() : [],
  );
  private readonly detailsWidth = signal(200);
  readonly embedWidth = computed(() => {
    const width = this.detailsWidth();
    return width >= 840 ? width / 2 : width;
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

    effect(onCleanup => {
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

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  open(url: string): void {
    window.open(url);
  }

  private init(deck: Deck): void {
    this.loadShareComponent(deck);
    this.seoService.update(deck.title, deck.description);
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
