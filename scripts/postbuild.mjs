import { copyFileSync } from 'node:fs';

const browser = 'dist/slides-today/browser';

// Hosting serves 404.html with a 404 status, and the router renders the not-found page in it.
copyFileSync(`${browser}/index.csr.html`, `${browser}/404.html`);
