import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Deck } from '../models/deck';

@Component({
  selector: 'app-deck-summary',
  styleUrls: ['./deck-summary.component.scss'],
  templateUrl: './deck-summary.component.html',
  standalone: false,
})
export class DeckSummaryComponent implements OnInit {
  private router = inject(Router);

  @Input() deck!: Deck;
  @ViewChild('cardEl', { static: true }) cardEl!: ElementRef;

  url = '';

  ngOnInit(): void {
    this.url = this.router.createUrlTree(['/decks', this.deck.id]).toString();
  }
}
