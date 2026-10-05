import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { basename, join } from 'node:path';
import { pageCacheControl } from './app/cache-control.server';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

// The same headers the Firebase Hosting config applied before this server.
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'same-origin',
  });
  next();
});

// The service worker files must always be revalidated, and the hashed bundles never change.
const REVALIDATED_FILES = new Set(['ngsw-worker.js', 'ngsw.json', 'sw.js']);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1h',
    index: false,
    redirect: false,
    setHeaders: (res, path) => {
      const name = basename(path);
      if (REVALIDATED_FILES.has(name)) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (/\.(js|css)$/.test(name)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      } else if (/\.(jpe?g|gif|png)$/.test(name)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(response => {
      if (!response) {
        return next();
      }
      const cacheControl = pageCacheControl(
        response.status,
        response.headers.get('Cache-Control'),
      );
      if (cacheControl) {
        res.setHeader('Cache-Control', cacheControl);
      }
      return writeResponseToNodeResponse(response, res);
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, error => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
