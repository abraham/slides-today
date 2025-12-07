import { enableProdMode, importProvidersFrom } from '@angular/core';

import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
} from '@angular/fire/compat/analytics';
import { AngularFirePerformanceModule } from '@angular/fire/compat/performance';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ServiceWorkerModule,
  SwRegistrationOptions,
} from '@angular/service-worker';
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
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireAnalyticsModule,
      AngularFirePerformanceModule,
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
    ScreenTrackingService,
    SeoService,
  ],
}).catch(err => console.error(err));
