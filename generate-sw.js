const workboxBuild = require('workbox-build');
const SRC_DIR = 'src';
const BUILD_DIR = 'dist';

const input = {
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR,
  globPatterns: [
    '**/*.{js,png,jpg,html,css}',
    'assets/**/*'
  ],
  globIgnores: [
    'sw.js',
    '**/*original*'
  ],
  navigateFallback: '/index.html',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/maps\.googleapis\.com\/(.*)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'runtime-maps',
        cacheExpiration: {
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {statuses: [0, 200]}
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/(.*)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'runtime-fonts',
        cacheExpiration: {
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {statuses: [0, 200]}
      }
    },
    {
      urlPattern: /^https:\/\/unpkg\.com\/(.*)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'runtime-scripts',
        cacheExpiration: {
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {statuses: [0, 200]}
      }
    },
    {
      urlPattern: /^https:\/\/api\.github\.com\/(.*)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'runtime-data',
        cacheExpiration: {
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {statuses: [0, 200]}
      }
    },
    {
      urlPattern: /^https:\/\/pbs\.twimg\.com\/(.*)/,
      handler: 'cacheFirst',
      options: {
        cacheName: 'runtime-images',
        cacheExpiration: {
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {statuses: [0, 200]}
      }
    },
  ],
  handleFetch: true,
  maximumFileSizeToCacheInBytes: 4000000
};

workboxBuild.generateSW(input).then(() => {
  console.log('The production service worker has been injected with a precache list.');
});
