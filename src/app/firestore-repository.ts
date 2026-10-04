import type { Firestore } from 'firebase/firestore';

// Kept free of Angular and relative imports so the emulator test can run it in Node.
export const firestoreRepository = <T>(
  name: string,
  getDb: () => Promise<Firestore>,
): { list(): Promise<T[]> } => ({
  async list() {
    const [{ collection, getDocs }, db] = await Promise.all([
      import('firebase/firestore'),
      getDb(),
    ]);
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map(doc => doc.data() as T);
  },
});
