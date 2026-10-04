import { isDeepStrictEqual } from 'node:util';
import {
  COLLECTIONS,
  deckDocument,
  publishedDecks,
} from '../src/app/collections.ts';
import decks from '../src/app/decks.data.json' with { type: 'json' };
import events from '../src/app/events.data.json' with { type: 'json' };
import speakers from '../src/app/speakers.data.json' with { type: 'json' };
import sponsors from '../src/app/sponsors.data.json' with { type: 'json' };
import tags from '../src/app/tags.data.json' with { type: 'json' };
import type { RawDeck } from '../src/app/models/deck.ts';

export type Doc = { id: string };

export interface Plan {
  writes: Doc[];
  deletes: string[];
  counts: {
    created: number;
    updated: number;
    unchanged: number;
    deleted: number;
  };
}

export const desiredDocuments = (): Record<string, Doc[]> => ({
  [COLLECTIONS.decks]: publishedDecks(decks as RawDeck[]).map(deckDocument),
  [COLLECTIONS.events]: events,
  [COLLECTIONS.speakers]: speakers,
  [COLLECTIONS.sponsors]: sponsors,
  [COLLECTIONS.tags]: tags,
});

export const plan = (
  name: string,
  docs: Doc[],
  existing: Map<string, unknown>,
): Plan => {
  const ids = new Set(docs.map(({ id }) => id));
  if (ids.size !== docs.length) {
    throw new Error(`Duplicate ids in ${name}`);
  }
  const counts = { created: 0, updated: 0, unchanged: 0, deleted: 0 };
  const writes: Doc[] = [];
  for (const doc of docs) {
    const current = existing.get(doc.id);
    if (current === undefined) {
      counts.created++;
    } else if (isDeepStrictEqual(current, doc)) {
      counts.unchanged++;
      continue;
    } else {
      counts.updated++;
    }
    writes.push(doc);
  }
  const deletes = [...existing.keys()].filter(id => !ids.has(id));
  counts.deleted = deletes.length;
  return { writes, deletes, counts };
};
