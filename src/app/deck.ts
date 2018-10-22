import dayjs from 'dayjs';
import { Link } from './link';
import tweetsData from './tweets.data.json';

export class Deck {
  description: string;
  eventTitle: string;
  githubRepos: string[];
  nodePackages: string[];
  id: string;
  links: Link[];
  location: string;
  speakers: string[];
  sponsors: string[];
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
    this.description = data.description;
    this.eventTitle = data.eventTitle;
    this.githubRepos = data.githubRepos;
    this.id = data.id;
    this.links = data.links;
    this.location = data.location;
    this.nodePackages = data.nodePackages;
    this.speakers = data.speakers;
    this.sponsors = data.sponsors;
    this.tags = data.tags;
    this.title = data.title;
    this.tweets = data.tweets.map((id: string) => tweetsData[id]);
  }

  public get date(): string {
    if (this._date.start.isSame(this._date.end)) {
      return this._date.start.format('MMM D, YYYY');
    } else {
      return `${this._date.start.format('MMM D')}-${this._date.end.format('D, YYYY')}`;
    }
  }

  public set tags(tags: string[]) {
    this._tags = this._uniqueTags(tags);
  }
  public get tags(): string[] {
    return this._tags;
  }

  private _uniqueTags(tags): string[] {
    const working: string[] = [];
    tags.map((tag) => {
      if (!working.includes(tag)) {
        working.push(tag);
      }
    });
    this._linkTags().map(tag => {
      if (!working.includes(tag)) {
        working.push(tag);
      }
    });
    return working;
  }

  private _linkTags(): string[] {
    return this.links.filter(link => link.useAsTag).map(link => link.title.toLowerCase());
  }
}
