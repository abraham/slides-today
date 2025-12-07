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
import { CardComponent } from '../card/card.component';
import { AsyncPipe } from '@angular/common';
import { TagListPipe } from '../tag-list.pipe';

@Component({
  selector: 'app-deck-summary',
  styleUrls: ['./deck-summary.component.scss'],
  templateUrl: './deck-summary.component.html',
  imports: [CardComponent, AsyncPipe, TagListPipe],
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
