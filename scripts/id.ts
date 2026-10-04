import { randomInt } from 'node:crypto';

// Firestore auto IDs are generated client side, so no credentials or network are needed.
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

console.log(
  Array.from({ length: 20 }, () => CHARS[randomInt(CHARS.length)]).join(''),
);
