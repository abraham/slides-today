import { Link } from './link';
import tweetsData from './tweets.data.json';

export class Deck {
  date: string;
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

  constructor(data: any) {
    this.date = data.date;
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
    return this.links.filter(link => link.tag).map(link => link.title.toLowerCase());
  }
}
