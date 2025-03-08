import { enableProdMode, Provider } from '@angular/core';

import { ScreenTrackingService } from '@angular/fire/compat/analytics';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ServiceWorkerModule,
  SwRegistrationOptions,
} from '@angular/service-worker';
import { SeoService } from './app/seo.service';
import { environment } from './environments/environment';

import { AppComponent } from './app/app.component';

const swOptions: SwRegistrationOptions = {
  enabled: environment.production,
};

const ServiceWorker = ServiceWorkerModule.register('ngsw-worker.js', swOptions)
  .providers as Provider[];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [ScreenTrackingService, SeoService, provideAnimations()].concat(
    ServiceWorker,
  ),
}).catch(err => console.error(err));
