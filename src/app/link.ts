import { Service } from './service';

export class Link {
  title: string;
  url: string;
  tag: boolean;
  service: Service;

  constructor(data: any) {
    this.title = data.title;
    this.url = data.url;
    this.tag = data.tag;
    this.service = data.service;
  }
}
