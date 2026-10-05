import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { LOAD_STATUS } from './services/tweet.service';
import { readStatus } from './tweet-loader.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: LOAD_STATUS, useValue: readStatus },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
