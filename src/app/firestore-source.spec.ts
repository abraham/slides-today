import { initializeApp } from 'firebase/app';
import {
  getDocs,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { environment } from '../environments/environment';
import { firestoreCollection } from './firestore-source';

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(async () => ({ docs: [] })),
  initializeFirestore: vi.fn(() => ({})),
  persistentLocalCache: vi.fn(() => 'cache'),
  persistentMultipleTabManager: vi.fn(() => 'tabs'),
}));

describe('firestoreCollection', () => {
  it('initializes Firestore once, with an offline cache shared by tabs', async () => {
    await firestoreCollection('decks').list();
    await firestoreCollection('tags').list();

    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(initializeApp).toHaveBeenCalledExactlyOnceWith(environment.firebase);
    expect(persistentMultipleTabManager).toHaveBeenCalledOnce();
    expect(persistentLocalCache).toHaveBeenCalledExactlyOnceWith({
      tabManager: 'tabs',
    });
    expect(initializeFirestore).toHaveBeenCalledExactlyOnceWith(
      expect.anything(),
      { localCache: 'cache' },
    );
  });
});
