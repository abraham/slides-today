// Firebase Performance reads window.perfMetrics (set by this) to report First Input Delay.
import 'first-input-delay';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
