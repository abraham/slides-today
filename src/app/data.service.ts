import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Deck } from './deck';
import decks from './decks.data.json';
import { Link } from './link';
import { Speaker } from './speaker';
import speakers from './speakers.data.json';
import { Sponsor } from './sponsor';
import sponsors from './sponsors.data.json';
import { Tag } from './tag';
import tags from './tags.data.json';

const DECKS: Deck[] = decks.map(deck => {
  return new Deck({
    ...deck,
    links: deck.links.map(link => new Link(link))
  });
});

@Injectable()
export class DataService {
  public decks$ = of(DECKS);
  public tags$ = of(tags);
  public speakers$ = of(speakers);

  public deck$(id: string): Observable<Deck> {
    return of(DECKS.find(deck => deck.id === id));
  }

  public filterTags$(ids: string[]): Observable<Tag[]> {
    return of(tags.filter(tag => ids.includes(tag.id)));
  }

  public tag$(id: string): Observable<Tag> {
    return of(tags.find(tag => tag.id === id));
  }

  public speaker$(id: string): Observable<Speaker> {
    return of(speakers.find(speaker => speaker.id === id) as Speaker);
  }

  public filterSponsors$(ids: string[]): Observable<Sponsor[]> {
    return of(sponsors.filter(sponsor => ids.includes(sponsor.id)));
  }
}
