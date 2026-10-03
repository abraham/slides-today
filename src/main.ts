import {
  enableProdMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, Router } from '@angular/router';
import {
  ServiceWorkerModule,
  SwRegistrationOptions,
} from '@angular/service-worker';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/modules/app-routing.module';
import { CardModule } from './app/modules/card.module';
import { SeoService } from './app/seo.service';
import { environment } from './environments/environment';

const swOptions: SwRegistrationOptions = {
  enabled: environment.production,
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AppRoutingModule,
      BrowserAnimationsModule,
      BrowserModule,
      CardModule,
      MatButtonModule,
      MatIconModule,
      MatToolbarModule,
      NgxSkeletonLoaderModule,
      ServiceWorkerModule.register('ngsw-worker.js', swOptions),
    ),
    SeoService,
    provideAppInitializer(() => {
      const app = initializeApp(environment.firebase);
      const analytics = getAnalytics(app);
      getPerformance(app);
      inject(Router).events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          logEvent(analytics, 'screen_view', {
            firebase_screen: event.urlAfterRedirects,
            firebase_screen_class: 'AppComponent',
          });
        }
      });
    }),
  ],
}).catch(err => console.error(err));
