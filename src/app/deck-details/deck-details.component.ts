import { Location } from '@angular/common';
import {
  AfterContentChecked,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Deck } from '../models/deck';
import { Link } from '../models/link';
import { EmbeddedServices } from '../models/service';
import { DEFAULT_THEME } from '../models/theme';

interface DeckData extends Data {
  deck: Deck;
}

@Component({
  selector: 'app-deck-details',
  styleUrls: ['./deck-details.component.scss'],
  templateUrl: './deck-details.component.html',
})
export class DeckDetailsComponent implements OnInit, AfterContentChecked {
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private viewContainer: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
  ) {
    this.deck$.subscribe(deck => this.init(deck));
  }

  @ViewChild('detailsEl') detailsEl!: ElementRef;

  showBack = true; // Show back button in app bar
  title = ''; // Clear site title
  deck$ = new ReplaySubject<Deck>();
  embeds: Link[] = [];
  embedWidth = 200;
  colors = DEFAULT_THEME;

  ngOnInit() {
    this.route.data.subscribe(data => this.deck$.next((data as DeckData).deck));
  }

  ngAfterContentChecked() {
    this.setEmbedWidth();
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

  private init(deck: Deck) {
    this.setEmbedWidth();
    this.setEmbeds(deck);
    this.loadShareComponent(deck);
  }

  private async loadShareComponent(deck: Deck) {
    setTimeout(async () => {
      const { ShareComponent } = await import(
        /* webpackChunkName: 'share' */ '../share/share.component'
      );
      const share = this.viewContainer.createComponent(
        this.resolver.resolveComponentFactory(ShareComponent),
      );
      share.instance.text = deck.title;
    }, 1000);
  }

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

  private setEmbedWidth(): void {
    if (this.embedWidth !== this.columnWidth) {
      this.embedWidth = this.columnWidth;
    }
  }

  private setEmbeds(deck: Deck): void {
    this.embeds = deck.links.filter(({ service }) => {
      return Object.keys(EmbeddedServices).includes(service);
    });
  }
}
