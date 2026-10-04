import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { deleteApp, initializeApp } from 'firebase/app';
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getDocs,
  initializeFirestore,
  memoryLocalCache,
  setDoc,
  terminate,
} from 'firebase/firestore';
import { firestoreRepository } from '../src/app/firestore-repository.ts';
import { desiredDocuments } from './firestore-sync.ts';

const script = fileURLToPath(new URL('./sync-firestore.ts', import.meta.url));
const projectId = 'slides-today-repository-test';
const [host, port] = (process.env['FIRESTORE_EMULATOR_HOST'] ?? '').split(':');

// Run through `npm run test:scripts:emulator`, which starts the emulator with firestore.rules.
describe('firestoreRepository', { skip: !host && 'needs the emulator' }, () => {
  const app = initializeApp({ projectId }, 'repository-test');
  const db = initializeFirestore(app, { localCache: memoryLocalCache() });
  connectFirestoreEmulator(db, host!, Number(port));

  before(() => {
    execFileSync(process.execPath, [script], {
      env: { ...process.env, GCLOUD_PROJECT: projectId },
    });
  });

  after(async () => {
    await terminate(db);
    await deleteApp(app);
  });

  for (const [name, docs] of Object.entries(desiredDocuments())) {
    it(`reads the ${name} collection`, async () => {
      const result = await firestoreRepository<{ id: string }>(
        name,
        async () => db,
      ).list();

      assert.deepEqual(
        result.sort((a, b) => a.id.localeCompare(b.id)),
        [...docs].sort((a, b) => a.id.localeCompare(b.id)),
      );
    });
  }

  it('does not let clients write', async () => {
    await assert.rejects(setDoc(doc(db, 'decks', 'new'), { id: 'new' }), {
      code: 'permission-denied',
    });
  });

  it('does not let clients read other collections', async () => {
    await assert.rejects(getDocs(collection(db, 'other')), {
      code: 'permission-denied',
    });
  });
});
