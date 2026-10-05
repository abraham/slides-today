import { PAGE_CACHE_CONTROL, pageCacheControl } from './cache-control.server';

describe('pageCacheControl', () => {
  it.each([200, 404])('lets the CDN cache a %i page', status => {
    expect(pageCacheControl(status, null)).toBe(PAGE_CACHE_CONTROL);
  });

  it.each([302, 400, 500])('does not cache a %i response', status => {
    expect(pageCacheControl(status, null)).toBeUndefined();
  });

  it('keeps a Cache-Control header the response already has', () => {
    expect(pageCacheControl(200, 'no-store')).toBeUndefined();
  });

  it('revalidates in the browser and caches in the CDN', () => {
    expect(PAGE_CACHE_CONTROL).toMatch(/\bpublic\b/);
    expect(PAGE_CACHE_CONTROL).toMatch(/\bmax-age=0\b/);
    expect(PAGE_CACHE_CONTROL).toMatch(/\bs-maxage=\d+\b/);
  });
});
