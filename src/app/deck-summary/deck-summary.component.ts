import { Component, Input, OnInit, HostBinding, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { Deck } from '../deck';

@Component({
  selector: 'app-deck-summary',
  templateUrl: './deck-summary.component.html',
  styleUrls: ['./deck-summary.component.css']
})

export class DeckSummaryComponent implements OnInit, OnChanges {
  constructor (private router: Router) {}

  @Input() deck: Deck;
  @Input() currentTag: string;

  @HostBinding('style.display') display = 'inline';

  offset = -200;
  imageLoaded: false;
  defaultImage = '/assets/img/default.jpg';
  url: string;
  mapUrl: string;
  coverStyle = { 'background-size': 'cover' };

  private key = 'AIzaSyBxTKLxL_bTN7s2U85AgzhDSBh3EoobixY';
  private size = '450x250';
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
    this.setMapUrl();
    this.setUrl();
  }

  ngOnChanges(changes) {
      if (changes.currentTag) {
        this.setDisplay();
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

  setUrl(): void {
    this.url = this.router.createUrlTree(['/decks', this.deck.id]).toString();
  }

  goToDeck(): void {
    this.router.navigate([this.url]);
  }

  setDisplay(): void {
    const hidden = this.currentTag && !this.deck.tags.includes(this.currentTag);
    if (hidden) {
      this.display = 'none';
    } else {
      this.display = 'inline';
    }
  }
}
