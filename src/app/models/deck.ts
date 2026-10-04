import Data from '../decks.data.json';
import tagData from '../tags.data.json';
import { EventOccurrence, findOccurrence } from './event';
import { Link } from './link';
import { Resource } from './resource';
import { Tag } from './tag';
import { DEFAULT_THEME, Theme } from './theme';

type RawDeck = (typeof Data)[number];

export class Deck {
  archived: boolean;
  description: string;
  eventTitle: string;
  githubRepos: string[];
  id: string;
  legacyId: string;
  links: Link[];
  resources: Resource[];
  location: string;
  nodePackages: string[];
  occurrences: EventOccurrence[];
  speakerIds: string[];
  sponsorIds: string[];
  title: string;
  tweetIds: string[];

  private cachedTags: string[] = [];

  constructor(
    data: RawDeck,
    occurrences = data.events.map(({ eventId, occurrenceId }) =>
      findOccurrence(eventId, occurrenceId),
    ),
  ) {
    // The first occurrence is the primary one and provides the date and location.
    const [primary] = occurrences;
    if (!primary) {
      throw new Error(`Deck ${data.id} has no event occurrences`);
    }
    this.archived = data.archived;
    this.description = data.description;
    this.eventTitle = [...new Set(occurrences.map(o => o.eventTitle))].join(
      ' & ',
    );
    this.githubRepos = data.githubRepos;
    this.id = data.id;
    this.legacyId = data.legacyId;
    // Event links come first, as the event is the context of the deck.
    this.links = [
      ...occurrences.flatMap(o => o.links),
      ...(data.links as Link[]),
    ];
    this.resources = data.resources as Resource[];
    this.location = primary.location;
    this.nodePackages = data.nodePackages;
    this.occurrences = occurrences;
    this.speakerIds = data.speakerIds;
    this.sponsorIds = data.sponsorIds;
    this.tags = data.tags;
    this.title = data.title;
    this.tweetIds = data.tweetIds;
  }

  get date(): string {
    return this.occurrences[0]!.date;
  }

  get theme(): Theme {
    if (this.primaryTag) {
      return {
        backgroundColor: this.primaryTag.primaryColor,
        color: this.primaryTag.complementaryColor,
      };
    } else {
      return DEFAULT_THEME;
    }
  }

  get tags(): string[] {
    return this.cachedTags;
  }

  private get primaryTag(): Tag | undefined {
    const [firstTagId] = this.tags;
    return tagData.find((tag: Tag) => tag.id === firstTagId);
  }

  private get linkTags(): string[] {
    return this.links
      .concat(this.resources)
      .filter(link => link.useAsTag)
      .map(link => link.title.toLowerCase());
  }

  set tags(baseTags: string[]) {
    this.cachedTags = [...new Set(baseTags.concat(this.linkTags))];
  }
}
