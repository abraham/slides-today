import { Link } from './link';

export class Deck {
  date: string;
  description: string;
  eventTitle: string;
  id: string;
  links: Link[];
  location: string;
  speakers: string[];
  title: string;
  sponsors: string[];

  private _tags: string[];

  constructor(data: any) {
    this.date = data.date;
    this.description = data.description;
    this.eventTitle = data.eventTitle;
    this.id = data.id;
    this.links = data.links;
    this.location = data.location;
    this.speakers = data.speakers;
    this.sponsors = data.sponsors;
    this.tags = data.tags;
    this.title = data.title;
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
