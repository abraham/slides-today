import type { Firestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { firestoreRepository } from './firestore-repository';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db: unknown, name: string) => ({ db, name })),
  getDocs: vi.fn(),
}));

describe('firestoreRepository', () => {
  const db = { type: 'db' } as unknown as Firestore;

  it('lists the data of every document in the collection', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [{ data: () => ({ id: 'a' }) }, { data: () => ({ id: 'b' }) }],
    } as never);

    const result = await firestoreRepository('decks', async () => db).list();

    expect(collection).toHaveBeenCalledWith(db, 'decks');
    expect(getDocs).toHaveBeenCalledWith({ db, name: 'decks' });
    expect(result).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('rejects when the read fails', async () => {
    vi.mocked(getDocs).mockRejectedValue(new Error('permission-denied'));

    await expect(
      firestoreRepository('decks', async () => db).list(),
    ).rejects.toThrow('permission-denied');
  });
});
