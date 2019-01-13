import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { filter, scan } from 'rxjs/operators';
import { Deck } from './deck';
import decks from './decks.data.json';
import { Speaker } from './speaker';
import speakers from './speakers.data.json';
import { Sponsor } from './sponsor';
import sponsors from './sponsors.data.json';
import { Tag, TagSelectionEvent } from './tag';
import tags from './tags.data.json';

const DECKS: Deck[] = decks.map(deck => {
  return new Deck(deck);
});

@Injectable()
export class DataService {
  constructor() {
    this.tagSelection$.pipe(
      scan<TagSelectionEvent, string[]>(this.updateSelectedTagIds.bind(this), []),
    ).subscribe(selectedTagIds => this.selectedTagIds$.next(selectedTagIds));
  }

  public decks$ = of(...DECKS).pipe(filter(deck => !deck.archived));
  public tags$ = of(tags);
  public speakers$ = of(speakers);
  public selectedTagIds$ = new BehaviorSubject<string[]>([]);

  private tagSelection$ = new Subject<TagSelectionEvent>();

  public tagSelection(event: TagSelectionEvent) {
    console.log('DataService.tagSelection', event);
    this.tagSelection$.next(event);
  }

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

  private updateSelectedTagIds(selectedTagIds: string[], event: TagSelectionEvent): string[] {
    if (event.selected) {
      return unique([...selectedTagIds, event.id]);
    } else {
      return selectedTagIds.filter(tagId => tagId !== event.id);
    }
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
