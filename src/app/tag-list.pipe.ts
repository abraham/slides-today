import { Pipe, PipeTransform } from '@angular/core';
import { formatTagList } from './models/text';

@Pipe({
  name: 'tagList',
})
export class TagListPipe implements PipeTransform {
  async transform(tags: string[] | null): Promise<string> {
    return formatTagList(tags || []);
  }
}
