import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardModule } from './card/card.module';
import { DataService } from './data.service';
import { HeaderComponent } from './header/header.component';
import { TagModule } from './tag/tag.module';

@NgModule({
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
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TagModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
