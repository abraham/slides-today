import { Component, RESPONSE_INIT, inject, input } from '@angular/core';
import { SeoService } from '../seo.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-not-found',
  styleUrl: './not-found.component.scss',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  readonly text = input('Page Not Found');

  constructor() {
    const themeService = inject(ThemeService);
    const seoService = inject(SeoService);

    // Only set while server rendering.
    const response = inject(RESPONSE_INIT, { optional: true });
    if (response) {
      response.status = 404;
    }

    themeService.reset();
    seoService.update(
      'Page not found',
      "The page you are looking for doesn't seem to be here.",
    );
  }
}
