import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
} from '@angular/fire/compat/analytics';
import { AngularFirePerformanceModule } from '@angular/fire/compat/performance';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ServiceWorkerModule,
  SwRegistrationOptions,
} from '@angular/service-worker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { CardModule } from './modules/card.module';
import { TagModule } from './modules/tag.module';
import { SeoService } from './seo.service';

const swOptions: SwRegistrationOptions = {
  enabled: environment.production,
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, HeaderComponent],
  imports: [
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
    TagModule,
  ],
  providers: [ScreenTrackingService, SeoService],
})
export class AppModule {}
