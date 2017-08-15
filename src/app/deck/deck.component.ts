import { Component, Input } from '@angular/core';
import { Deck } from '../deck';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent {
  @Input() deck: Deck;

  private key = 'AIzaSyBxTKLxL_bTN7s2U85AgzhDSBh3EoobixY';
  private size = '450x250';
  private zoom = '9';
  private maptype = 'terrain';
  private apiUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  private styles = [
    'feature:administrative.land_parcel%7Cvisibility:off',
    'feature:administrative.neighborhood%7Cvisibility:off',
    'feature:landscape%7Ccolor:0xf3f4f4%7Cvisibility:on',
    'feature:landscape.man_made%7Celement:geometry%7Cvisibility:off%7Cweight:0.9',
    'feature:poi%7Celement:labels.text%7Cvisibility:off',
    'feature:poi.park%7Celement:geometry.fill%7Ccolor:0x83cead%7Cvisibility:on',
    'feature:road%7Ccolor:0xffffff%7Cvisibility:on',
    'feature:road%7Celement:labels%7Cvisibility:off',
    'feature:road.arterial%7Ccolor:0xfee379%7Cvisibility:off',
    'feature:road.highway%7Ccolor:0xfee379%7Cvisibility:on',
    'feature:road.highway%7Celement:labels%7Cvisibility:off',
    'feature:road.local%7Cvisibility:off',
    'feature:water%7Ccolor:0x7fc8ed%7Cvisibility:on',
    'feature:water%7Celement:labels.text%7Cvisibility:off'
  ];

  private center(): string {
    return encodeURIComponent(this.deck.location);
  }

  private styleParams(): string {
    return `style=${this.styles.join('&style=')}`;
  }

  private apiParams(): string {
    return `${this.styleParams()}&maptype=${this.maptype}&zoom=${this.zoom}&size=${this.size}&center=${this.center()}&key=${this.key}`;
  }

  mapUrl(): string {
    return `${this.apiUrl}?${this.apiParams()}`;
  }

  open(url: string): void {
    window.open(url);
  }
}
