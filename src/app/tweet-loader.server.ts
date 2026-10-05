import type { StatusLoader } from './services/tweet.service';

// A glob import, so the statuses are bundled with the server instead of read from disk.
export const readStatus: StatusLoader = async id => {
  if (!/^\d+$/.test(id)) {
    throw new Error(`Invalid status id ${id}`);
  }
  return (await import(`../assets/statuses/${id}.json`)).default;
};
