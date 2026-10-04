import type { Firestore } from 'firebase/firestore';
import { environment } from '../environments/environment';
import { firestoreRepository } from './firestore-repository';

const create = async (): Promise<Firestore> => {
  const [{ initializeApp }, firestore] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);
  return firestore.initializeFirestore(initializeApp(environment.firebase), {
    localCache: firestore.persistentLocalCache({
      tabManager: firestore.persistentMultipleTabManager(),
    }),
  });
};

// Initialized once on first read; Firestore throws if initialized twice.
let db: Promise<Firestore> | undefined;
const getDb = (): Promise<Firestore> => (db ??= create());

export const firestoreCollection = <T>(name: string) =>
  firestoreRepository<T>(name, getDb);
