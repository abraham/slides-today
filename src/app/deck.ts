import { Status } from 'twitter-d';
import { Link } from './link';
import { Resource } from './resource';
import { Tag } from './tag';
import tagData from './tags.data.json';
import { formatTagList } from './text';

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
    start: Date;
    end: Date;
  };

  constructor(data: any) {
    this.cachedDate = {
      start: new Date(Date.parse(data.date.start)),
      end: new Date(Date.parse(data.date.end)),
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
    if (this.cachedDate.start.getDate() === this.cachedDate.end.getDate()) {
      return `${this.startMonth} ${this.cachedDate.start.getDate()}, ${this.cachedDate.start.getFullYear()}`;
    } else {
      return `${this.startMonth} ${this.cachedDate.start.getDate()}-${this.cachedDate.end.getDate()}, ${this.cachedDate.end.getFullYear()}`;
    }
  }

  set tags(baseTags: string[]) {
    this.cachedTags = baseTags.concat(this.linkTags)
      .reduce((uniqueTags: string[], tag: string) => {
      return uniqueTags.includes(tag) ? uniqueTags : uniqueTags.concat(tag);
    }, []);
  }

  get tags(): string[] {
    return this.cachedTags;
  }

  get tagsSentence(): string {
    return formatTagList(this.tags);
  }

  get theme() {
    return {
      primaryColor: this.primaryTag.primaryColor,
      complementaryColor: this.primaryTag.complementaryColor,
    };
  }

  private get startMonth(): string {
    return this.cachedDate.start.toLocaleString('en-us', { month: 'short' });
  }

  private get primaryTag(): Tag {
    return tagData.find(tag => tag.id === this.tags[0]) as Tag;
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
