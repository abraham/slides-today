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

  // The query params of the `/filters` route are the only record of the selection.
  private readonly filterParams = computed(() => {
    const url = this.router.lastSuccessfulNavigation()?.finalUrl;
    const segment = url?.root.children[PRIMARY_OUTLET]?.segments[0];
    return url && segment?.path === 'filters' ? url.queryParams : {};
  });

  readonly selectedTagIds = computed(() =>
    this.listParam(this.filterParams()['tags']),
  );

  readonly selectedSpeakerIds = computed(() =>
    this.listParam(this.filterParams()['speakers']),
  );

  readonly selectedEventIds = computed(() =>
    this.listParam(this.filterParams()['events']),
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

  setFilter(name: 'tags' | 'speakers' | 'events', ids: string[]): void {
    const selected = {
      tags: this.selectedTagIds(),
      speakers: this.selectedSpeakerIds(),
      events: this.selectedEventIds(),
    };
    const othersEmpty = Object.entries(selected).every(
      ([key, value]) => key === name || value.length === 0,
    );
    if (ids.length === 0 && othersEmpty) {
      this.router.navigate(['/']);
      return;
    }
    // Merging keeps the other filters; null drops this param.
    this.router.navigate(['/filters'], {
      queryParams: { [name]: ids.length ? ids.join(',') : null },
      queryParamsHandling: 'merge',
    });
  }

  private listParam(value: string | undefined): string[] {
    return (value ?? '').split(',').filter(id => id);
  }
}
