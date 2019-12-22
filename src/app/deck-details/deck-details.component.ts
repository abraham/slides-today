import { Location } from '@angular/common';
import { AfterContentChecked, Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DEFAULT_THEME, rgb, Theme } from '../color';
import { DataService } from '../data.service';
import { Deck } from '../deck';
import { Link } from '../link';
import { Tag } from '../tag';

@Component({
  selector: 'app-deck-details',
  styleUrls: ['./deck-details.component.scss'],
  templateUrl: './deck-details.component.html',
})
export class DeckDetailsComponent implements OnInit, AfterContentChecked {
  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router,
              private viewContainer: ViewContainerRef,
              private resolver: ComponentFactoryResolver) {
    this.deck$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.dataService.deck$(id)),
    );
    this.primaryTag$ = this.deck$.pipe(
      switchMap(deck => this.dataService.tag$(deck.tags[0])),
    );

    this.primaryTag$.subscribe((tag) => this.setColors(tag));
    this.deck$.subscribe((deck) => {
      this.deck = deck;
      this.init();
    });
    this.theme$ = this.dataService.theme$;
  }

  private deck: Deck;

  @ViewChild('detailsEl') detailsEl!: ElementRef;

  showBack = true; // Show back button in app bar
  title = ''; // Clear site title
  deck$: Observable<Deck>;
  theme$: Observable<Theme>;
  of = of;
  primaryTag$: Observable<Tag>;
  embeds: Link[] = [];
  embedWidth: number;
  colors: Theme = DEFAULT_THEME;

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadShareComponent();
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

  private init() {
    this.setEmbedWidth();
    this.setEmbeds(this.deck);
  }

  private async loadShareComponent() {
    setTimeout(async () => {
      const { ShareComponent } = await import(/* webpackChunkName: 'share' */ '../share/share.component');
      const share = this.viewContainer.createComponent(this.resolver.resolveComponentFactory(ShareComponent));
      share.instance.text = this.deck.title;
    }, 1000);
  }

  private get columnWidth(): number {
    if (!this.detailsEl) { return; }
    const width = this.detailsEl.nativeElement.getBoundingClientRect().width;
    if (width >= 640) {
      return width / 2;
    } else {
      return width;
    }
  }

  private setColors(tag: Tag): void {
    const theme = {
      backgroundColor: rgb(tag.primaryColor),
      color: rgb(tag.complementaryColor),
    };
    this.dataService.theme$.next(theme);
  }

  private setEmbedWidth(): void {
    if (this.embedWidth !== this.columnWidth) {
      this.embedWidth = this.columnWidth;
    }
  }

  private setEmbeds(deck: Deck): void {
    const embedServices = ['youtube', 'slides', 'vimeo'];
    this.embeds = deck.links.filter(link => embedServices.includes(link.service));
  }
}
