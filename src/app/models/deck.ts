import Data from '../decks.data.json';
import tagData from '../tags.data.json';
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
  speakerIds: string[];
  sponsorIds: string[];
  title: string;
  tweetIds: string[];

  private cachedTags: string[] = [];
  private cachedDate: {
    end: Date;
    start: Date;
  };

  constructor(data: RawDeck) {
    this.cachedDate = {
      end: new Date(data.date.end),
      start: new Date(data.date.start),
    };
    this.archived = data.archived;
    this.description = data.description;
    this.eventTitle = data.eventTitle;
    this.githubRepos = data.githubRepos;
    this.id = data.id;
    this.legacyId = data.legacyId;
    this.links = data.links as Link[];
    this.resources = data.resources as Resource[];
    this.location = data.location;
    this.nodePackages = data.nodePackages;
    this.speakerIds = data.speakerIds;
    this.sponsorIds = data.sponsorIds;
    this.tags = data.tags;
    this.title = data.title;
    this.tweetIds = data.tweetIds;
  }

  get date(): string {
    const { start, end } = this.cachedDate;
    const startDay = `${this.startMonth} ${start.getUTCDate()}`;
    const endDay = `${this.endMonth} ${end.getUTCDate()}`;
    if (start.getUTCFullYear() !== end.getUTCFullYear()) {
      return `${startDay}, ${start.getUTCFullYear()}-${endDay}, ${end.getUTCFullYear()}`;
    }
    if (start.getUTCMonth() !== end.getUTCMonth()) {
      return `${startDay}-${endDay}, ${end.getUTCFullYear()}`;
    }
    return `${startDay}, ${start.getUTCFullYear()}`;
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

  private get startMonth(): string {
    return this.cachedDate.start.toLocaleString('en-us', {
      month: 'short',
      timeZone: 'UTC',
    });
  }

  private get endMonth(): string {
    return this.cachedDate.end.toLocaleString('en-us', {
      month: 'short',
      timeZone: 'UTC',
    });
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
