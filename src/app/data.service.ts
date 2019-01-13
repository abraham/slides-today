import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, scan, tap } from 'rxjs/operators';
import { Deck } from './deck';
import deckData from './decks.data.json';
import { Speaker } from './speaker';
import speakers from './speakers.data.json';
import { Sponsor } from './sponsor';
import sponsors from './sponsors.data.json';
import { Tag, TagSelectionEvent } from './tag';
import tagData from './tags.data.json';

const DECKS: Deck[] = deckData.map(deck => new Deck(deck));

@Injectable()
export class DataService {
  constructor() {
    this.tagSelection$.pipe(
      scan<TagSelectionEvent, string[]>(this.updateSelectedTagIds.bind(this), []),
      tap(selections => console.log('DataService.constructor.selections', selections)),
    ).subscribe(selectedTagIds => this.selectedTagIds$.next(selectedTagIds));

    this.tags$.next(tagData);
  }

  public decks$ = of(DECKS).pipe(map(decks => decks.filter(deck => !deck.archived)));
  public selectedTagIds$ = new BehaviorSubject<string[]>([]);
  public speakers$ = of(speakers);
  public tags$ = new BehaviorSubject<Tag[]>([]);

  private tagSelection$ = new Subject<TagSelectionEvent>();

  public tagSelection(event: TagSelectionEvent) {
    console.log('DataService.tagSelection', event);
    this.tagSelection$.next(event);
  }

  public deck$(id: string): Observable<Deck> {
    return of(DECKS.find(deck => deck.id === id));
  }

  public filterDecks$(selectedTagIds$: Observable<string[]>): Observable<Deck[]> {
    return combineLatest(
      this.decks$,
      selectedTagIds$,
      this.filterDecks,
    ).pipe(
      tap(thing => console.log('DataService.filterDecks$1', thing)),
    );
  }

  public filterTags$(ids: string[]): Observable<Tag[]> {
    if (ids === undefined || ids.length === 0) {
      return this.tags$;
    }
    return this.tags$.pipe(
      map(tags => tags.filter(tag => ids.includes(tag.id))),
    );
  }

  public tag$(id: string): Observable<Tag> {
    return of(tagData.find(tag => tag.id === id));
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

  private filterDecks(decks: Deck[], tags: string[]): Deck[] {
    return decks.filter(deck => {
      return tags.every(tag => {
        return deck.tags.includes(tag);
      });
    });
  }
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
