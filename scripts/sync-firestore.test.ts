import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import decks from '../src/app/decks.data.json' with { type: 'json' };
import { desiredDocuments } from './firestore-sync.ts';

const script = fileURLToPath(new URL('./sync-firestore.ts', import.meta.url));
const projectId = 'slides-today-sync-test';

// Run through `npm run test:scripts:emulator`, which starts the emulator.
describe(
  'sync-firestore',
  { skip: !process.env['FIRESTORE_EMULATOR_HOST'] && 'needs the emulator' },
  () => {
    const db = getFirestore(initializeApp({ projectId }));
    const desired = desiredDocuments();
    const run = (...args: string[]): string =>
      execFileSync(process.execPath, [script, ...args], {
        encoding: 'utf8',
        env: { ...process.env, GCLOUD_PROJECT: projectId },
      });
    const ids = async (name: string): Promise<string[]> =>
      (await db.collection(name).get()).docs.map(({ id }) => id).sort();
    const counts = (output: string, name: string, numbers: string): void =>
      assert.ok(
        output.includes(`${name} { ${numbers} }`),
        `${name}: ${numbers}\n${output}`,
      );

    it('writes nothing on a dry run', async () => {
      const output = run('--dry-run');

      assert.match(output, /Dry run/);
      for (const name of Object.keys(desired)) {
        assert.deepEqual(await ids(name), [], name);
      }
    });

    it('writes every collection without the archived decks', async () => {
      run();

      for (const [name, docs] of Object.entries(desired)) {
        assert.deepEqual(await ids(name), docs.map(({ id }) => id).sort());
      }
      const archived = decks.filter(deck => deck.archived).map(({ id }) => id);
      const written = await ids('decks');
      assert.ok(archived.length > 0);
      assert.deepEqual(
        written.filter(id => archived.includes(id)),
        [],
      );
    });

    it('stores the event ids on the decks', async () => {
      const snapshot = await db.collection('decks').get();

      for (const doc of snapshot.docs) {
        const { events, eventIds } = doc.data() as {
          events: { eventId: string }[];
          eventIds: string[];
        };
        assert.deepEqual(
          [...eventIds].sort(),
          [...new Set(events.map(({ eventId }) => eventId))].sort(),
        );
      }
    });

    it('changes nothing when run again', () => {
      const output = run();

      for (const [name, docs] of Object.entries(desired)) {
        counts(
          output,
          name,
          `created: 0, updated: 0, unchanged: ${docs.length}, deleted: 0`,
        );
      }
    });

    it('repairs documents that drifted', async () => {
      const [deck] = desired['decks']!;
      const [speaker] = desired['speakers']!;
      await db.collection('decks').doc(deck!.id).update({ title: 'Changed' });
      await db.collection('decks').doc('stray').set({ archived: true });
      await db.collection('speakers').doc(speaker!.id).delete();

      const output = run();

      counts(
        output,
        'decks',
        `created: 0, updated: 1, unchanged: ${desired['decks']!.length - 1}, deleted: 1`,
      );
      counts(
        output,
        'speakers',
        `created: 1, updated: 0, unchanged: ${desired['speakers']!.length - 1}, deleted: 0`,
      );
      assert.equal(
        (await db.collection('decks').doc(deck!.id).get()).get('title'),
        (deck as unknown as { title: string }).title,
      );
      assert.equal(
        (await db.collection('decks').doc('stray').get()).exists,
        false,
      );
    });
  },
);
