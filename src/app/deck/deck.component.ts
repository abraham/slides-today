import { Component, Input } from '@angular/core';
import { Deck } from '../deck';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent {
  @Input() deck: Deck;

  open(url: string): void {
    window.open(url);
  }
}
