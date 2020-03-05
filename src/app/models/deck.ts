import { Status } from 'twitter-d';
import tagData from '../tags.data.json';
import { Link } from './link';
import { Resource } from './resource';
import { Tag } from './tag';
import { Theme } from './theme';

export class Deck {
  archived: boolean;
  description: string;
  eventTitle: string;
  githubRepos: string[];
  id: string;
  links: Link[];
  resources: Resource[];
  location: string;
  nodePackages: string[];
  speakerIds: string[];
  sponsorIds: string[];
  title: string;
  tweetIds: string[];

  private cachedTweets?: Promise<Status[]>;
  private cachedTags: string[] = [];
  private cachedDate: {
    end: Date;
    start: Date;
  };

  constructor(data: any) {
    this.cachedDate = {
      end: new Date(data.date.end),
      start: new Date(data.date.start),
    };
    this.archived = data.archived;
    this.description = data.description;
    this.eventTitle = data.eventTitle;
    this.githubRepos = data.githubRepos;
    this.id = data.id;
    this.links = data.links;
    this.resources = data.resources;
    this.location = data.location;
    this.nodePackages = data.nodePackages;
    this.speakerIds = data.speakerIds;
    this.sponsorIds = data.sponsorIds;
    this.tags = data.tags;
    this.title = data.title;
    this.tweetIds = data.tweetIds;
  }

  get tweets(): Promise<Status[]> {
    if (this.cachedTweets) {
      return this.cachedTweets;
    }
    this.cachedTweets = Promise.all(this.tweetIds.map(this.getStatus));
    return this.cachedTweets;
  }

  get date(): string {
    // TODO: Support dates that span two years
    if (this.cachedDate.start.getUTCDate() === this.cachedDate.end.getUTCDate()) {
      return `${this.startMonth} ${this.cachedDate.start.getUTCDate()}, ${this.cachedDate.start.getFullYear()}`;
    } else if (this.cachedDate.start.getMonth() === this.cachedDate.end.getMonth()) {
      return `${this.startMonth} ${this.cachedDate.start.getUTCDate()}, ${this.cachedDate.start.getFullYear()}`;
    } else {
      return `${this.startMonth} ${this.cachedDate.start.getUTCDate()}-${this.endMonth} ${this.cachedDate.end.getUTCDate()}, ${this.cachedDate.end.getFullYear()}`;
    }
  }

  set tags(baseTags: string[]) {
    this.cachedTags = [...new Set(baseTags.concat(this.linkTags))];
  }

  get tags(): string[] {
    return this.cachedTags;
  }

  get theme(): Theme {
    return {
      backgroundColor: this.primaryTag.primaryColor,
      color: this.primaryTag.complementaryColor,
    };
  }

  private get startMonth(): string {
    return this.cachedDate.start.toLocaleString('en-us', { month: 'short' });
  }

  private get endMonth(): string {
    return this.cachedDate.end.toLocaleString('en-us', { month: 'short' });
  }

  private get primaryTag(): Tag {
    return tagData.find((tag: Tag) => tag.id === this.tags[0]);
  }

  private get linkTags(): string[] {
    return this.links.concat(this.resources)
      .filter(link => link.useAsTag)
      .map(link => link.title.toLowerCase());
  }

  private async getStatus(id: string): Promise<Status> {
    const request = await fetch(`/assets/statuses/${id}.json`);
    return await request.json();
  }
}
