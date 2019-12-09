import dayjs from 'dayjs';
import { Status } from 'twitter-d';
import { Link } from './link';
import { Resource } from './resource';
import { Tag } from './tag';
import tagData from './tags.data.json';

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

  private _cachedTweets? : Promise<Status[]>;
  private _tags: string[];
  private _date: {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
  };

  constructor(data: any) {
    this._date = {
      start: dayjs(data.date.start).add(1, 'day'),
      end: dayjs(data.date.end).add(1, 'day')
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

  public get tweets(): Promise<Status[]> {
    if (this._cachedTweets) {
      return this._cachedTweets;
    }
    this._cachedTweets = Promise.all(this.tweetIds.map(this.getStatus));
    return this._cachedTweets;
  }

  public get date(): string {
    if (this._date.start.isSame(this._date.end)) {
      return this._date.start.format('MMM D, YYYY');
    } else {
      return `${this._date.start.format('MMM D')}-${this._date.end.format('D, YYYY')}`;
    }
  }

  public set tags(baseTags: string[]) {
    this._tags = baseTags.concat(this.linkTags)
      .reduce((uniqueTags, tag) => {
      return uniqueTags.includes(tag) ? uniqueTags : uniqueTags.concat(tag);
    }, []);
  }

  public get tags(): string[] {
    return this._tags;
  }

  public get theme() {
    return {
      primaryColor: this.primaryTag.primaryColor,
      complementaryColor: this.primaryTag.complementaryColor,
    };
  }

  private get primaryTag(): Tag {
    return tagData.find(tag => tag.id === this.tags[0])!;
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
