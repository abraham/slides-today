import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MDCToolbar } from '@material/toolbar/dist/mdc.toolbar';

import 'rxjs/add/operator/switchMap';

import { Deck } from '../deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [DeckService],
})
export class DetailsComponent implements OnInit {

  constructor(private deckService: DeckService,
              private route: ActivatedRoute,
              private location: Location) { }

  @Input() deck: Deck;

  @ViewChild('toolbarFixedEl') toolbarFixedEl;

  currentTag: string;
  title = 'Slides.today';
  toolbar: MDCToolbar;
  defaultImage = '/assets/img/default.png';

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
        return this.deckService.getDeck(+ params.get('id'));
      })
      .subscribe(deck => this.deck = deck);
    this.initToolbar();
  }

  goBack(): void {
    this.location.back();
  }

  open(url: string): void {
    window.open(url);
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

  mapUrl(): string {
    return `${this.apiUrl}?${this.apiParams()}`;
  }

  initToolbar(): void {
    this.toolbar = new MDCToolbar(this.toolbarFixedEl.nativeElement);
  }

}
