import firebase from '../../firebase.json';
import decks from './decks.data.json';

const { hosting } = firebase;

describe('firebase.json hosting', () => {
  describe('redirects', () => {
    const rules = new Map(hosting.redirects.map(rule => [rule.source, rule]));

    it('sends /decks to the home page', () => {
      expect(rules.get('/decks')).toEqual({
        source: '/decks',
        destination: '/',
        type: 301,
      });
    });

    it('moves every unarchived legacy deck id to its deck, so `npm run sync:redirects` is current', () => {
      const missing = decks
        .filter(({ archived, legacyId }) => !archived && legacyId)
        .filter(
          ({ id, legacyId }) =>
            rules.get(`/decks/${legacyId}`)?.destination !== `/decks/${id}`,
        )
        .map(({ legacyId }) => legacyId);

      expect(missing).toEqual([]);
    });

    it('only redirects to decks that are prerendered', () => {
      const live = new Set(
        decks.filter(({ archived }) => !archived).map(({ id }) => id),
      );
      const dead = hosting.redirects
        .filter(({ source }) => source.startsWith('/decks/'))
        .filter(({ destination }) => !live.has(destination.split('/').pop()!))
        .map(({ source }) => source);

      expect(dead).toEqual([]);
    });

    it('has no duplicate sources', () => {
      expect(rules.size).toBe(hosting.redirects.length);
    });
  });

  describe('rewrites', () => {
    it('only serves the client shell for /filters, so other unknown urls are real 404s', () => {
      expect(hosting.rewrites).toEqual([
        { source: '/filters', destination: '/index.csr.html' },
      ]);
    });
  });

  it('serves directory index files without a trailing slash', () => {
    expect(hosting.trailingSlash).toBe(false);
  });
});
