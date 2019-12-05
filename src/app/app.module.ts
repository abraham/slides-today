import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardModule } from './card/card.module';
import { DataService } from './data.service';
import { HeaderComponent } from './header/header.component';
import { TagModule } from './tag/tag.module';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UpdateComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CardModule,
    LazyLoadImageModule,
    TagModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
