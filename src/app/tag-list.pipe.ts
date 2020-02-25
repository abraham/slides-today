import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagList'
})
export class TagListPipe implements PipeTransform {
  transform(tags: string[]|null): string {
    return (tags || []).map(tag => `#${tag}`).join(', ');
  }
}
