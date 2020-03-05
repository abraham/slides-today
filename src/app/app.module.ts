import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule, SwRegistrationOptions } from '@angular/service-worker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardModule } from './card/card.module';
import { HeaderComponent } from './header/header.component';
import { TagModule } from './tag/tag.module';

// TODO: `twitter-status` keeps `registerWhenStable` from ever firing on details page which prevents SW from installing.
const swOptions: SwRegistrationOptions = {
  enabled: environment.production,
  registrationStrategy: 'registerImmediately',
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
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
export class AppModule { }
