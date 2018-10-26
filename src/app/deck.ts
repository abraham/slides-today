import dayjs from 'dayjs';
import { Link } from './link';
import { Resource } from './resource';
import tweetsData from './tweets.data.json';

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
  tweets: object[];

  private _tags: string[];
  private _date: {
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
  };

  constructor(data: any) {
    this._date = {
      start: dayjs(data.date.start),
      end: dayjs(data.date.end)
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
    this.tweets = data.tweetIds.map((id: string) => tweetsData[id]);
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

  private get linkTags(): string[] {
    return this.links.concat(this.resources)
      .filter(link => link.useAsTag)
      .map(link => link.title.toLowerCase());
  }
}
