import * as firebase from 'firebase-admin';
import serviceAccount from '../slides-today-firebase-adminsdk.json';

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as firebase.ServiceAccount),
  databaseURL: 'https://slides-today.firebaseio.com'
});

const store = firebase.firestore();
const db = firebase.database();
console.log(`Firestore: ${store.collection('decks').doc().id}`);
console.log(`Database: ${db.ref('decks').push().key}`);
db.goOffline(); // Prevents a persistent connection from being kept open.
