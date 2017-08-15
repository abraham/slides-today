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

  private center(): string {
    return encodeURIComponent(this.deck.location);
  }

  open(url: string): void {
    window.open(url);
  }

  mapUrl(): string {
    return `https://maps.googleapis.com/maps/api/staticmap?zoom=${this.zoom}&size=${this.size}&center=${this.center()}&key=${this.key}`;
  }
}
