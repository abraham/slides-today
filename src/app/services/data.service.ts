import { Injectable, computed, inject } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { Tag } from '../models/tag';
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

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly router = inject(Router);

  readonly tags: Tag[] = [...tagData].sort(sortTags);

  // The matrix params of the `/filters` route are the only record of the selection.
  private readonly filterParams = computed(() => {
    const segment =
      this.router.lastSuccessfulNavigation()?.finalUrl?.root.children[
        PRIMARY_OUTLET
      ]?.segments[0];
    return segment?.path === 'filters' ? segment.parameters : {};
  });

  readonly selectedTagIds = computed(() =>
    this.listParam(this.filterParams()['tags']),
  );

  filterTags(ids: string[]): Tag[] {
    if (ids.length === 0) {
      return this.tags;
    }
    return this.tags.filter(tag => ids.includes(tag.id));
  }

  tag(id: string): Tag | undefined {
    return this.tags.find(tag => tag.id === id);
  }

  private listParam(value: string | undefined): string[] {
    return (value ?? '').split(',').filter(id => id);
  }
}
