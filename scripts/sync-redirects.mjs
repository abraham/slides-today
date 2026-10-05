import { readFileSync, writeFileSync } from 'node:fs';

const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const decks = readJson('src/app/decks.data.json');
const config = readJson('firebase.json');

// Hosting can't run the deck resolver, so each old deck id needs its own rule.
const legacyRedirects = decks
  .filter(({ archived, legacyId }) => !archived && legacyId)
  .map(({ id, legacyId }) => ({
    source: `/decks/${legacyId}`,
    destination: `/decks/${id}`,
    type: 301,
  }));

config.hosting.redirects = [
  { source: '/decks', destination: '/', type: 301 },
  ...legacyRedirects,
];
writeFileSync('firebase.json', `${JSON.stringify(config, null, 2)}\n`);
console.log(
  `Wrote ${config.hosting.redirects.length} redirects to firebase.json.`,
);
