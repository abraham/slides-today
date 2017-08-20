import { Injectable } from '@angular/core';
import { Tag } from './tag';
import { TAGS } from './tags.data';

@Injectable()
export class TagService {
  getTags(): Promise<Tag[]> {
    return Promise.resolve(TAGS);
  }

  getTag(id: string): Promise<Tag> {
    return Promise.resolve(TAGS.find(tag => tag.id === id));
  }
}
