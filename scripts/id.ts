import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../.firebase-adminsdk.json';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  databaseURL: 'https://slides-today.firebaseio.com',
});

const store = getFirestore();
const db = getDatabase();
console.log(`Firestore: ${store.collection('decks').doc().id}`);
console.log(`Database: ${db.ref('decks').push().key}`);
db.goOffline(); // Prevents a persistent connection from being kept open.
