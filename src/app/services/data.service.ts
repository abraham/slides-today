import { Injectable, signal } from '@angular/core';
import { Tag, TagSelectionEvent } from '../models/tag';
import tagData from '../tags.data.json';

const sortTags = (a: Tag, b: Tag): -1 | 0 | 1 => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
};

const unique = (values: string[]): string[] => [...new Set(values)];

const equalArray = (array1: string[], array2: string[]): boolean => {
  if (array1.length !== array2.length) {
    return false;
  }
  const sorted2 = [...array2].sort();
  return [...array1].sort().every((value, index) => value === sorted2[index]);
};

const equalPath = (a: string[] | undefined, b: string[] | undefined): boolean =>
  a !== undefined && b !== undefined && equalArray(a, b);

@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly tags: Tag[] = [...tagData].sort(sortTags);

  private readonly selectedTagIdsState = signal<string[]>([]);
  // Only set by selections that should update the URL; undefined until the first one.
  private readonly pathState = signal<string[] | undefined>(undefined, {
    equal: equalPath,
  });

  readonly selectedTagIds = this.selectedTagIdsState.asReadonly();
  readonly path = this.pathState.asReadonly();

  tagSelection(event: TagSelectionEvent): void {
    const selectedTagIds = this.updateSelectedTagIds(
      this.selectedTagIdsState(),
      event,
    );
    this.selectedTagIdsState.set(selectedTagIds);
    if (event.updatePath) {
      this.pathState.set(selectedTagIds);
    }
  }

  filterTags(ids: string[]): Tag[] {
    if (ids.length === 0) {
      return this.tags;
    }
    return this.tags.filter(tag => ids.includes(tag.id));
  }

  tag(id: string): Tag | undefined {
    return this.tags.find(tag => tag.id === id);
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
