import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export enum IncludeSiteTitle {
  yes,
  no,
}

export const DEFAULT_TITLE =
  'Slides.today | Presentations from Abraham Williams and Pearl Latteier';
export const DEFAULT_DESCRIPTION =
  'Slide decks for conference and meetup presentations by Abraham Williams and Pearl Latteier';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private titleService: Title, private metaService: Meta) {}

  public reset() {
    this.update(DEFAULT_TITLE, DEFAULT_DESCRIPTION, IncludeSiteTitle.no);
  }

  public update(
    title: string,
    description: string,
    includeSiteTitle: IncludeSiteTitle = IncludeSiteTitle.yes,
  ) {
    if (includeSiteTitle === IncludeSiteTitle.yes) {
      title = `${title} | Slides.today`;
    }
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'og:title', content: title });

    description = this.trimDescription(description);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    this.metaService.updateTag({
      name: 'og:description',
      content: description,
    });

    // TODO: Support updating image
  }

  private trimDescription(description: string) {
    const chunks = description.match(/.{1,160}(\.|\?|\!|$)/g);
    if (chunks?.[0]) {
      return chunks[0].trim();
    } else {
      return description;
    }
  }
}
