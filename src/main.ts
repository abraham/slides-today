import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import(/* webpackChunkName: 'components' */ 'github-repository');
import(/* webpackChunkName: 'components' */ 'node-package');
import(/* webpackChunkName: 'components' */ 'twitter-status');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
