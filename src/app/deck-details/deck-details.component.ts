import { Location } from '@angular/common';
import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { rgb, Theme } from '../color';
import { DataService } from '../data.service';
import { Deck } from '../deck';
import { Link } from '../link';
import { Tag } from '../tag';

@Component({
  selector: 'app-deck-details',
  templateUrl: './deck-details.component.html',
  styleUrls: ['./deck-details.component.scss'],
})
export class DeckDetailsComponent implements OnInit, AfterContentChecked {
  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router) {
    this.deck$ = this.route.paramMap.pipe(
      tap((thing) => console.log('DeckDetailsComponent.ctor.id1', thing.get('id'))),
      map(params => params.get('id')),
      switchMap(id => this.dataService.deck$(id)),
      tap((thing) => console.log('DeckDetailsComponent.ctor.id2', thing)),
    );
    this.primaryTag$ = this.deck$.pipe(
      switchMap(deck => this.dataService.tag$(deck.tags[0])),
      tap((thing) => console.log('DeckDetailsComponent.ctor.id3', thing)),
    );

    this.primaryTag$.subscribe(this.setColors.bind(this));
    this.deck$.subscribe(this.init.bind(this));
  }

  @Input() deck: Deck;
  @Output() onColorsChange = new EventEmitter<Theme>();
  @ViewChild('detailsEl') detailsEl;

  title = ''; // Clear site title
  deck$: Observable<Deck>;
  of = of;
  primaryTag$: Observable<Tag>;
  defaultImage = '/assets/img/default.png';
  mapUrl: string;
  embeds: Link[];
  embedWidth: number;
  colors: {
    color: string,
    backgroundColor: string,
  };

  ngOnInit() {
    window.scrollTo(0, 0);
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
  }

  private columnWidth(): number {
    console.log('DeckDetails.columnWidth', this.detailsEl);
    if (!this.detailsEl) { return; }
    const width = this.detailsEl.nativeElement.getBoundingClientRect().width;
    if (width >= 640) {
      return width / 2;
    } else {
      return width;
    }
  }

  private setColors(tag: Tag): void {
    console.log('DeckDetails.setColors', tag, this);
    this.colors = {
      backgroundColor: rgb(tag.primaryColor),
      color: rgb(tag.complementaryColor),
    };
    this.onColorsChange.emit(this.colors);
  }

  private setEmbedWidth(): void {
    if (this.embedWidth !== this.columnWidth()) {
      this.embedWidth = this.columnWidth();
    }
  }

  private setEmbeds(deck: Deck): void {
    const embedServices = ['youtube', 'google-slides', 'vimeo'];
    this.embeds = deck.links.filter(link => embedServices.includes(link.service));
  }
}
