import { InjectionToken } from '@angular/core';
import { COLLECTIONS } from './collections';
import { RawDeck } from './models/deck';
import { RawEvent } from './models/event';
import { Speaker } from './models/speaker';
import { Sponsor } from './models/sponsor';
import { Tag } from './models/tag';

export interface Repository<T> {
  list(): Promise<T[]>;
}

// DATA_SOURCE is a build-time define. Only a dynamic import inside the branch is
// dropped with it, so the Firestore code must be reached from nowhere else.
// The module default is typed by the JSON itself, so the caller states the model type.
const repository = <T>(
  name: string,
  load: () => Promise<{ default: unknown }>,
): Repository<T> =>
  DATA_SOURCE === 'firestore'
    ? {
        list: async () =>
          (await import('./firestore-source'))
            .firestoreCollection<T>(name)
            .list(),
      }
    : { list: async () => (await load()).default as T[] };

export const DECKS = new InjectionToken<Repository<RawDeck>>('DECKS', {
  providedIn: 'root',
  factory: () =>
    repository(COLLECTIONS.decks, () => import('./decks.data.json')),
});

export const EVENTS = new InjectionToken<Repository<RawEvent>>('EVENTS', {
  providedIn: 'root',
  factory: () =>
    repository(COLLECTIONS.events, () => import('./events.data.json')),
});

export const SPEAKERS = new InjectionToken<Repository<Speaker>>('SPEAKERS', {
  providedIn: 'root',
  factory: () =>
    repository(COLLECTIONS.speakers, () => import('./speakers.data.json')),
});

export const SPONSORS = new InjectionToken<Repository<Sponsor>>('SPONSORS', {
  providedIn: 'root',
  factory: () =>
    repository(COLLECTIONS.sponsors, () => import('./sponsors.data.json')),
});

export const TAGS = new InjectionToken<Repository<Tag>>('TAGS', {
  providedIn: 'root',
  factory: () => repository(COLLECTIONS.tags, () => import('./tags.data.json')),
});
