import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { desiredDocuments, plan } from './firestore-sync.ts';

const dryRun = process.argv.includes('--dry-run');
const projectId = process.env['GCLOUD_PROJECT'] ?? 'slides-today';
// Without FIRESTORE_EMULATOR_HOST this writes to the real project.
const emulator = !!process.env['FIRESTORE_EMULATOR_HOST'];

initializeApp({
  projectId,
  ...(emulator ? {} : { credential: applicationDefault() }),
});
const db = getFirestore();

(async () => {
  console.log(
    `${dryRun ? 'Dry run: ' : ''}Syncing to ${projectId}${emulator ? ' (emulator)' : ''}`,
  );
  for (const [name, docs] of Object.entries(desiredDocuments())) {
    const collection = db.collection(name);
    const existing = new Map(
      (await collection.get()).docs.map(doc => [doc.id, doc.data()]),
    );
    const { writes, deletes, counts } = plan(name, docs, existing);
    if (!dryRun) {
      const writer = db.bulkWriter();
      for (const doc of writes) {
        void writer.set(collection.doc(doc.id), doc);
      }
      for (const id of deletes) {
        void writer.delete(collection.doc(id));
      }
      await writer.close();
    }
    console.log(name, counts);
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
