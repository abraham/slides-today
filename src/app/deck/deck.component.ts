import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { MdChipsModule } from '@angular/material';
import { MDCRipple } from '@material/ripple/dist/mdc.ripple';
import { NgClass } from '@angular/common';

import { Deck } from '../deck';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent implements AfterViewInit {
  @Input() deck: Deck;
  @Input() currentTag: string;

  @ViewChild('actions') actions;

  offset = -200;
  currentStyles = {};
  imageLoaded: false;
  defaultImage = '/assets/img/loading.gif';
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

  ngAfterViewInit(): void {
    this.initRipples();
  }

  initRipples(): void {
    const buttons = this.actions.nativeElement.querySelectorAll('.mdc-button:not(.mdc-ripple-upgraded)');
    Array.from(buttons).forEach(button => {
      MDCRipple.attachTo(button);
    });
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

  setCurrentStyles(): void {
    if (this.imageLoaded) {
      this.currentStyles = {
        'background-size': 'cover'
      };
    } else {
      this.currentStyles = {};
    }
  }

  mapUrl(): string {
    return `${this.apiUrl}?${this.apiParams()}`;
  }

  open(url: string): void {
    window.open(url);
  }
}
