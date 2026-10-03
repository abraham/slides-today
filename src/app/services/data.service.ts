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

@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly tags: Tag[] = [...tagData].sort(sortTags);

  private readonly selectedTagIdsState = signal<string[]>([]);

  readonly selectedTagIds = this.selectedTagIdsState.asReadonly();

  tagSelection(event: TagSelectionEvent): void {
    this.selectedTagIdsState.update(selectedTagIds =>
      this.updateSelectedTagIds(selectedTagIds, event),
    );
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
