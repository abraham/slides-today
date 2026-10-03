import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export enum IncludeSiteTitle {
  yes,
  no,
}

export const DEFAULT_TITLE =
  'Slides.today | Presentations from Abraham Williams and Pearl Latteier';
export const DEFAULT_DESCRIPTION =
  'Slide decks for conference and meetup presentations by Abraham Williams and Pearl Latteier';
export const DEFAULT_IMAGE = '/assets/icons/icon-512x512.png';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);

  public reset() {
    this.update(DEFAULT_TITLE, DEFAULT_DESCRIPTION, IncludeSiteTitle.no);
  }

  public update(
    title: string,
    description: string,
    includeSiteTitle: IncludeSiteTitle = IncludeSiteTitle.yes,
    image: string = DEFAULT_IMAGE,
  ) {
    if (includeSiteTitle === IncludeSiteTitle.yes) {
      title = `${title} | Slides.today`;
    }
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ property: 'og:title', content: title });

    description = this.trimDescription(description);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });

    // Social crawlers need an absolute image URL.
    const imageUrl = new URL(image, this.document.baseURI).href;
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ name: 'twitter:image:alt', content: title });
    this.metaService.updateTag({ property: 'og:image:alt', content: title });
  }

  private trimDescription(description: string) {
    const chunks = description.match(/.{1,160}(\.|\?|!|$)/g);
    if (chunks?.[0]) {
      return chunks[0].trim();
    } else {
      return description;
    }
  }
}
