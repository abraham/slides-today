import { InjectionToken } from '@angular/core';
import { RawDeck } from './models/deck';
import { RawEvent } from './models/event';
import { Speaker } from './models/speaker';
import { Sponsor } from './models/sponsor';
import { Tag } from './models/tag';

export interface Repository<T> {
  list(): Promise<T[]>;
}

// The module default is typed by the JSON itself, so the caller states the model type.
const jsonRepository = <T>(
  load: () => Promise<{ default: unknown }>,
): Repository<T> => ({
  list: async () => (await load()).default as T[],
});

export const DECKS = new InjectionToken<Repository<RawDeck>>('DECKS', {
  providedIn: 'root',
  factory: () => jsonRepository(() => import('./decks.data.json')),
});

export const EVENTS = new InjectionToken<Repository<RawEvent>>('EVENTS', {
  providedIn: 'root',
  factory: () => jsonRepository(() => import('./events.data.json')),
});

export const SPEAKERS = new InjectionToken<Repository<Speaker>>('SPEAKERS', {
  providedIn: 'root',
  factory: () => jsonRepository(() => import('./speakers.data.json')),
});

export const SPONSORS = new InjectionToken<Repository<Sponsor>>('SPONSORS', {
  providedIn: 'root',
  factory: () => jsonRepository(() => import('./sponsors.data.json')),
});

export const TAGS = new InjectionToken<Repository<Tag>>('TAGS', {
  providedIn: 'root',
  factory: () => jsonRepository(() => import('./tags.data.json')),
});
