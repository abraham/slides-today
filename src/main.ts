import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  NavigationEnd,
  Router,
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withInMemoryScrolling,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      ...(environment.production ? [] : [withDebugTracing()]),
    ),
    provideServiceWorker('ngsw-worker.js', { enabled: environment.production }),
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
