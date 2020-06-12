import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
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

const swOptions: SwRegistrationOptions = {
  enabled: environment.production,
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, HeaderComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirePerformanceModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CardModule,
    NgxSkeletonLoaderModule,
    ServiceWorkerModule.register('ngsw-worker.js', swOptions),
    TagModule,
  ],
})
export class AppModule {}
