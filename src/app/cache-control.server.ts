// Cloud CDN only caches these statuses, and the content only changes with a deploy.
const CACHEABLE_STATUSES = new Set([200, 404]);

// Browsers revalidate, so a rollout reaches them at once, while the CDN absorbs the traffic.
export const PAGE_CACHE_CONTROL =
  'public, max-age=0, s-maxage=600, stale-while-revalidate=60';

export const pageCacheControl = (
  status: number,
  existing: string | null,
): string | undefined =>
  CACHEABLE_STATUSES.has(status) && !existing ? PAGE_CACHE_CONTROL : undefined;
