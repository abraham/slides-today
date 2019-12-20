import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, scan, share } from 'rxjs/operators';
import { DEFAULT_THEME, Theme } from './color';
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
    ).subscribe(selectedTagIds => this.selectedTagIds$.next(selectedTagIds));
    this.tags$.next(tagData);
  }

  decks$ = of(DECKS).pipe(map(decks => decks.filter(deck => !deck.archived)));
  selectedTagIds$ = new BehaviorSubject<string[]>([]);
  speakers$ = of(speakers);
  tags$ = new BehaviorSubject<Tag[]>([]);
  theme$ = new BehaviorSubject<Theme>(DEFAULT_THEME);

  private tagSelection$ = new Subject<TagSelectionEvent>();

  get path$(): Observable<string[]> {
    return combineLatest([
      this.tagSelection$,
      this.selectedTagIds$,
    ]).pipe(
      share(),
      filter(([selection, _]) => selection.updatePath),
      map(([_, selectedTagIds]) => selectedTagIds),
      distinctUntilChanged(equalArray),
    );
  }

  resetTheme() {
    this.theme$.next(DEFAULT_THEME);
  }

  tagSelection(event: TagSelectionEvent) {
    this.tagSelection$.next(event);
  }

  deck$(id: string): Observable<Deck> {
    return of(DECKS.find(deck => deck.id === id));
  }

  filterDecks$(selectedTagIds$: Observable<string[]>): Observable<Deck[]> {
    return combineLatest(
      this.decks$,
      selectedTagIds$,
      this.filterDecks,
    );
  }

  filterTags$(ids: string[]): Observable<Tag[]> {
    if (ids === undefined || ids.length === 0) {
      return this.tags$;
    }
    return this.tags$.pipe(
      map(tags => tags.filter(tag => ids.includes(tag.id))),
    );
  }

  tag$(id: string): Observable<Tag> {
    return of(tagData.find(tag => tag.id === id));
  }

  speaker$(id: string): Observable<Speaker> {
    return of(speakers.find(speaker => speaker.id === id) as Speaker);
  }

  filterSponsors$(ids: string[]): Observable<Sponsor[]> {
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

function equalArray(array1: string[], array2: string[]) {
  return array1.length === array2.length &&
    array1.sort().every((value, index) => {
      return value === array2.sort()[index];
    });
}
