import { Link } from './link';

export class Deck {
  id: number;
  title: string;
  date: string;
  description: string;
  eventTitle: string;
  private _tags: string[];
  location: string;
  links: Link[];

  constructor(deck: any) {
    this.id = deck.id;
    this.title = deck.title;
    this.date = deck.date;
    this.description = deck.description;
    this.eventTitle = deck.eventTitle;
    this.location = deck.location;
    this.links = deck.links;
    this.tags = deck.tags;
  }

  public set tags(tags: string[]) {
    this._tags = this._uniqueTags(tags);
  }
  public get tags(): string[] {
    return this._tags;
  }

  private _uniqueTags(tags): string[] {
    const working: string[] = this._linkTags();
    tags.map((tag) => {
      if (!working.includes(tag)) {
        working.push(tag);
      }
    });
    return working.sort();
  }

  private _linkTags(): string[] {
    return this.links.filter(link => link.tag).map(link => link.title.toLowerCase());
  }
}
