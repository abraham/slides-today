import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withInMemoryScrolling,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { AnalyticsService } from './services/analytics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      ...(environment.production ? [] : [withDebugTracing()]),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAppInitializer(() => inject(AnalyticsService).init()),
    // Lets `<mat-icon fontIcon="...">` render ligatures with CSS instead of text
    // content, so the icon name is not treated as visible text.
    provideAppInitializer(() => {
      inject(MatIconRegistry).registerFontClassAlias(
        'material-symbols-outlined',
        'material-symbols-outlined mat-ligature-font',
      );
    }),
  ],
};
