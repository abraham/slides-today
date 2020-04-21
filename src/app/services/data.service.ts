import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, scan, share } from 'rxjs/operators';
import { Tag, TagSelectionEvent } from '../models/tag';
import tagData from '../tags.data.json';

function sortTags(a: Tag, b: Tag) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.primaryColor > b.id) {
    return 1;
  }
  return 0;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {
    this.tagSelection$
      .pipe(
        scan<TagSelectionEvent, string[]>(
          this.updateSelectedTagIds.bind(this),
          [],
        ),
      )
      .subscribe(selectedTagIds => this.selectedTagIds$.next(selectedTagIds));
    this.tags$.next(tagData.sort(sortTags));
  }

  selectedTagIds$ = new BehaviorSubject<string[]>([]);
  tags$ = new BehaviorSubject<Tag[]>([]);

  private tagSelection$ = new Subject<TagSelectionEvent>();

  get path$(): Observable<string[]> {
    return combineLatest([this.tagSelection$, this.selectedTagIds$]).pipe(
      share(),
      filter(([selection, _]) => selection.updatePath),
      map(([_, selectedTagIds]) => selectedTagIds),
      distinctUntilChanged(equalArray),
    );
  }

  tagSelection(event: TagSelectionEvent) {
    this.tagSelection$.next(event);
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
    return of(tagData.find((tag: Tag) => tag.id === id));
  }

  private updateSelectedTagIds(
    selectedTagIds: string[],
    event: TagSelectionEvent,
  ): string[] {
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

function equalArray(array1: string[], array2: string[]) {
  return (
    array1.length === array2.length &&
    array1.sort().every((value, index) => {
      return value === array2.sort()[index];
    })
  );
}
