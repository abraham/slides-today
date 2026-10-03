import { Pipe, PipeTransform } from '@angular/core';
import { formatTagList } from './models/text';

@Pipe({ name: 'tagList' })
export class TagListPipe implements PipeTransform {
  transform(tags: string[] | null): string {
    return formatTagList(tags || []);
  }
}
