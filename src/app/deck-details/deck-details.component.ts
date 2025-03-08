import { Location, NgIf, NgFor, AsyncPipe } from '@angular/common';
import {
  AfterContentChecked,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmbeddedServices } from '../embedded-services';
import { Deck } from '../models/deck';
import { Link } from '../models/link';
import { DEFAULT_THEME } from '../models/theme';
import { SeoService } from '../seo.service';
import { CardComponent } from '../card/card.component';
import { TagsComponent } from '../tags/tags.component';
import { EmbedComponent } from '../embed/embed.component';
import { SpeakerComponent } from '../speaker/speaker.component';
import { MapComponent } from '../map/map.component';
import { SponsorComponent } from '../sponsor/sponsor.component';
import { DeckResourcesComponent } from '../deck-resources/deck-resources.component';

interface DeckData extends Data {
  deck: Deck;
}

@Component({
  selector: 'app-deck-details',
  styleUrls: ['./deck-details.component.scss'],
  templateUrl: './deck-details.component.html',
  imports: [
    NgIf,
    CardComponent,
    TagsComponent,
    NgFor,
    EmbedComponent,
    SpeakerComponent,
    MapComponent,
    SponsorComponent,
    DeckResourcesComponent,
    AsyncPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DeckDetailsComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  @ViewChild('detailsEl') detailsEl!: ElementRef;

  showBack = true; // Show back button in app bar
  title = ''; // Clear site title
  deck$ = new ReplaySubject<Deck>();
  embeds: Link[] = [];
  embedWidth = 200;
  colors = DEFAULT_THEME;

  private destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private viewContainer: ViewContainerRef,
    private seoService: SeoService,
  ) {}

  private get columnWidth(): number {
    if (!this.detailsEl) {
      return 0;
    }

    const { width } = this.detailsEl.nativeElement.getBoundingClientRect();
    if (width >= 840) {
      return width / 2;
    } else {
      return width;
    }
  }

  ngOnInit(): void {
    this.deck$
      .pipe(takeUntil(this.destroy$))
      .subscribe(deck => this.init(deck));
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.deck$.next((data as DeckData).deck));
  }

  ngAfterContentChecked(): void {
    this.setEmbedWidth();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
    this.setEmbedWidth();
    this.setEmbeds(deck);
    this.loadShareComponent(deck);
    this.seoService.update(deck.title, deck.description);
  }

  private async loadShareComponent(deck: Deck): Promise<void> {
    setTimeout(async () => {
      const module = await import(
        /* webpackChunkName: 'share' */ '../share/share.component'
      );
      const share = this.viewContainer.createComponent(module.ShareComponent);
      share.instance.text = deck.title;
    }, 1000);
  }

  private setEmbedWidth(): void {
    if (this.embedWidth !== this.columnWidth) {
      this.embedWidth = this.columnWidth;
    }
  }

  private setEmbeds(deck: Deck): void {
    this.embeds = deck.links.filter(({ service }) =>
      Object.keys(EmbeddedServices).includes(service),
    );
  }
}
