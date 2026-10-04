import decks from './decks.data.json';
import speakers from './speakers.data.json';
import sponsors from './sponsors.data.json';
import tags from './tags.data.json';

const SERVICES = [
  'external',
  'youtube',
  'slides',
  'joindin',
  'vimeo',
  'meetup',
];

const duplicates = (ids: string[]): string[] =>
  ids.filter((id, index) => ids.indexOf(id) !== index);

describe('data', () => {
  describe('ids', () => {
    it.each([
      ['decks', decks],
      ['speakers', speakers],
      ['sponsors', sponsors],
      ['tags', tags],
    ])('are unique for %s', (_name, items) => {
      expect(duplicates(items.map(item => item.id))).toEqual([]);
    });
  });

  describe('decks', () => {
    it('have Firestore ids and unique legacy ids', () => {
      const ids = decks.map(deck => deck.id);
      const legacyIds = decks.map(deck => deck.legacyId);

      expect(ids.filter(id => !/^[A-Za-z0-9]{20}$/.test(id))).toEqual([]);
      expect(duplicates(legacyIds)).toEqual([]);
      expect(legacyIds.filter(id => ids.includes(id))).toEqual([]);
    });

    const speakerIds = new Set(speakers.map(speaker => speaker.id));
    const sponsorIds = new Set(sponsors.map(sponsor => sponsor.id));
    const tagIds = new Set(tags.map(tag => tag.id));
    const links = decks.flatMap(deck =>
      [...deck.links, ...deck.resources].map(link => ({
        deck: deck.id,
        ...link,
      })),
    );
    const problems = <T>(items: T[], valid: (item: T) => boolean): T[] =>
      items.filter(item => !valid(item));

    it('only reference existing speakers', () => {
      const missing = decks.flatMap(deck =>
        deck.speakerIds
          .filter(id => !speakerIds.has(id))
          .map(id => `${deck.id}: ${id}`),
      );

      expect(missing).toEqual([]);
    });

    it('only reference existing sponsors', () => {
      const missing = decks.flatMap(deck =>
        deck.sponsorIds
          .filter(id => !sponsorIds.has(id))
          .map(id => `${deck.id}: ${id}`),
      );

      expect(missing).toEqual([]);
    });

    it('only use existing tags', () => {
      const missing = decks.flatMap(deck =>
        deck.tags.filter(id => !tagIds.has(id)).map(id => `${deck.id}: ${id}`),
      );

      expect(missing).toEqual([]);
    });

    it('have valid dates that do not end before they start', () => {
      const invalid = problems(decks, ({ date }) => {
        const start = new Date(date.start);
        const end = new Date(date.end);
        return !isNaN(+start) && !isNaN(+end) && start <= end;
      }).map(deck => deck.id);

      expect(invalid).toEqual([]);
    });

    it('list GitHub repos as owner/repo', () => {
      const invalid = decks.flatMap(deck =>
        deck.githubRepos
          .filter(repo => !/^[\w.-]+\/[\w.-]+$/.test(repo))
          .map(repo => `${deck.id}: ${repo}`),
      );

      expect(invalid).toEqual([]);
    });

    it('have links and resources with a known service and a valid url', () => {
      const invalid = problems(
        links,
        link => SERVICES.includes(link.service) && URL.canParse(link.url),
      ).map(link => `${link.deck}: ${link.service} ${link.url}`);

      expect(invalid).toEqual([]);
    });

    it('only embed Google Slides, Vimeo and YouTube from their own sites', () => {
      const origins: Record<string, string> = {
        slides: 'https://docs.google.com',
        vimeo: 'https://vimeo.com',
        youtube: 'https://www.youtube.com',
      };
      const invalid = links
        .filter(link => link.service in origins)
        .filter(
          link =>
            !URL.canParse(link.url) ||
            new URL(link.url).origin !== origins[link.service],
        )
        .map(link => `${link.deck}: ${link.service} ${link.url}`);

      expect(invalid).toEqual([]);
    });
  });

  describe('speakers and sponsors', () => {
    it('have valid link urls', () => {
      const invalid = speakers
        .flatMap(speaker => speaker.links)
        .filter(link => !URL.canParse(link.url))
        .map(link => link.url);

      expect(invalid).toEqual([]);
    });

    it('have valid sponsor urls', () => {
      const invalid = sponsors
        .filter(sponsor => !URL.canParse(sponsor.url))
        .map(sponsor => sponsor.id);

      expect(invalid).toEqual([]);
    });
  });
});
