import { Link } from './link';

export class Deck {
  id: string;
  title: string;
  date: string;
  description: string;
  eventTitle: string;
  private _tags: string[];
  location: string;
  links: Link[];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.date = data.date;
    this.description = data.description;
    this.eventTitle = data.eventTitle;
    this.location = data.location;
    this.links = data.links;
    this.tags = data.tags;
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
