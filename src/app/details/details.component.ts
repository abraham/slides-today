import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MDCToolbar } from '@material/toolbar/dist/mdc.toolbar';
import { Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Deck } from '../deck';
import { DeckService } from '../deck.service';
import { Tag } from '../tag';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DeckService, TagService],
})
export class DetailsComponent implements OnInit {

  constructor(private deckService: DeckService,
              private tagService: TagService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router,
              private sanitizer: DomSanitizer) { }

  @Input() deck: Deck;

  @ViewChild('toolbarFixedEl') toolbarFixedEl;
  @ViewChild('detailsEl') detailsEl;
  @ViewChild('embedEl') embedEl;

  currentTag: string;
  currentStyles = {};
  primaryTag: Tag;
  title = 'Slides.today';
  toolbar: MDCToolbar;
  defaultImage = '/assets/img/default.png';
  embedDimensions: { width: number, height: number };
  mapUrl: string;
  embedUrl: SafeResourceUrl;

  private key = 'AIzaSyBxTKLxL_bTN7s2U85AgzhDSBh3EoobixY';
  private size = '640x320';
  private zoom = '9';
  private maptype = 'terrain';
  private apiUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  private mapStyles = [
    'feature:administrative.land_parcel%7Cvisibility:off',
    'feature:administrative.neighborhood%7Cvisibility:off',
    'feature:landscape.man_made%7Celement:geometry.fill%7Chue:0x0cff00%7Csaturation:100%7Clightness:0%7Cgamma:0.42',
    'feature:landscape.natural.landcover%7Celement:geometry.fill%7Ccolor:0x37bda2',
    'feature:landscape.natural.terrain%7Celement:geometry.fill%7Ccolor:0x37bda2',
    'feature:poi%7Celement:labels.text%7Cvisibility:off',
    'feature:poi.attraction%7Celement:geometry.fill%7Cvisibility:on',
    'feature:poi.business%7Celement:geometry.fill%7Ccolor:0xe4dfd9',
    'feature:poi.business%7Celement:labels.icon%7Cvisibility:off',
    'feature:poi.park%7Celement:geometry.fill%7Ccolor:0x37bda2',
    'feature:road%7Celement:geometry.fill%7Ccolor:0x70b99b%7Cvisibility:on',
    'feature:road%7Celement:geometry.stroke%7Ccolor:0xfafeb8%7Cweight:1.25',
    'feature:road%7Celement:labels%7Cvisibility:off',
    'feature:road.arterial%7Cvisibility:off',
    'feature:road.highway%7Celement:labels%7Cvisibility:off',
    'feature:road.highway%7Celement:labels.icon%7Cvisibility:off',
    'feature:road.local%7Cvisibility:off',
    'feature:transit.station%7Celement:labels.icon%7Cvisibility:off',
    'feature:water%7Celement:geometry.fill%7Ccolor:0x5ddad6',
    'feature:water%7Celement:labels.text%7Cvisibility:off'
  ];

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        return Promise.all([
          this.deckService.getDeck(params.get('id')),
          this.tagService.getTags(),
        ]);
      })
      .subscribe(all => {
        this.deck = all[0];
        this.primaryTag = all[1].find(tag => tag.id === this.deck.tags[0]);
        this.setMapUrl();
        this.setEmbedUrl();
        this.setCurrentStyles();
      });
    this.initToolbar();
    this.setEmbedDimensions();
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

  setCurrentStyles(): void {
    if (this.primaryTag) {
      this.currentStyles = {
        backgroundColor: this.primaryTag.backgroundColor,
        color: this.primaryTag.color,
      };
    }
  }

  private center(): string {
    return encodeURIComponent(this.deck.location);
  }

  private styleParams(): string {
    return `style=${this.mapStyles.join('&style=')}`;
  }

  private apiParams(): string {
    return `${this.styleParams()}&maptype=${this.maptype}&zoom=${this.zoom}&size=${this.size}&center=${this.center()}&key=${this.key}`;
  }

  setMapUrl(): void {
    this.mapUrl = `${this.apiUrl}?${this.apiParams()}`;
  }

  setEmbedUrl(): void {
    const url = `${this.slideUrl()}/embed?start=false&loop=false&delayms=30000`;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  setEmbedDimensions(): void {
    const width = this.embedEl.nativeElement.offsetWidth - 32;
    const height = Math.round(width * 569 / 960) + 16;
    this.embedDimensions = { width: width, height: height };
  }

  slideUrl(): string {
    return this.deck.links.filter(link => link.title === 'Slides')[0].url;
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(this.toolbarFixedEl.nativeElement);
  }

}
