import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { COLLECTIONS } from '../src/app/collections.ts';
import decks from '../src/app/decks.data.json' with { type: 'json' };
import { desiredDocuments, plan } from './firestore-sync.ts';

describe('desiredDocuments', () => {
  const desired = desiredDocuments();

  it('has a list for every collection', () => {
    assert.deepEqual(
      Object.keys(desired).sort(),
      Object.values(COLLECTIONS).sort(),
    );
  });

  it('has unique ids in every collection', () => {
    for (const [name, docs] of Object.entries(desired)) {
      const ids = docs.map(({ id }) => id);
      assert.equal(new Set(ids).size, ids.length, name);
    }
  });

  it('skips archived decks', () => {
    const archived = decks.filter(deck => deck.archived).map(({ id }) => id);
    const ids = desired[COLLECTIONS.decks]!.map(({ id }) => id);

    assert.ok(archived.length > 0);
    assert.equal(ids.length, decks.length - archived.length);
    assert.deepEqual(
      ids.filter(id => archived.includes(id)),
      [],
    );
  });

  it('adds the event ids to every deck', () => {
    for (const deck of desired[COLLECTIONS.decks]!) {
      const { events, eventIds } = deck as unknown as {
        events: { eventId: string }[];
        eventIds: string[];
      };
      assert.deepEqual(
        [...eventIds].sort(),
        [...new Set(events.map(({ eventId }) => eventId))].sort(),
      );
    }
  });
});

describe('plan', () => {
  const docs = [
    { id: 'a', title: 'A', tags: ['x', 'y'] },
    { id: 'b', title: 'B', tags: [] },
  ];

  it('creates every document in an empty collection', () => {
    const result = plan('test', docs, new Map());

    assert.deepEqual(result.writes, docs);
    assert.deepEqual(result.deletes, []);
    assert.deepEqual(result.counts, {
      created: 2,
      updated: 0,
      unchanged: 0,
      deleted: 0,
    });
  });

  it('leaves equal documents alone, whatever their key order', () => {
    const existing = new Map<string, unknown>([
      ['a', { tags: ['x', 'y'], title: 'A', id: 'a' }],
      ['b', { id: 'b', title: 'B', tags: [] }],
    ]);

    const result = plan('test', docs, existing);

    assert.deepEqual(result.writes, []);
    assert.deepEqual(result.counts, {
      created: 0,
      updated: 0,
      unchanged: 2,
      deleted: 0,
    });
  });

  it('updates only the documents that changed', () => {
    const existing = new Map<string, unknown>([
      ['a', { id: 'a', title: 'A', tags: ['x'] }],
      ['b', { id: 'b', title: 'B', tags: [] }],
    ]);

    const result = plan('test', docs, existing);

    assert.deepEqual(result.writes, [docs[0]]);
    assert.deepEqual(result.counts, {
      created: 0,
      updated: 1,
      unchanged: 1,
      deleted: 0,
    });
  });

  it('deletes documents that are no longer in the data', () => {
    const existing = new Map<string, unknown>([
      ['a', docs[0]],
      ['b', docs[1]],
      ['gone', { id: 'gone' }],
    ]);

    const result = plan('test', docs, existing);

    assert.deepEqual(result.writes, []);
    assert.deepEqual(result.deletes, ['gone']);
    assert.equal(result.counts.deleted, 1);
  });

  it('throws on duplicate ids', () => {
    assert.throws(
      () => plan('test', [docs[0]!, docs[0]!], new Map()),
      /Duplicate ids in test/,
    );
  });
});
