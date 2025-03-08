import { Component, Input } from '@angular/core';
import { SeoService } from '../seo.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  @Input() text = 'Page Not Found';

  constructor(themeService: ThemeService, seoService: SeoService) {
    themeService.reset();
    seoService.update(
      'Page not found',
      "The page you are looking for doesn't seem to be here.",
    );
  }
}
