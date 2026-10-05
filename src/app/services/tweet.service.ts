import {
  InjectionToken,
  Injectable,
  PLATFORM_ID,
  TransferState,
  inject,
  makeStateKey,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import type { Status } from 'twitter-d';

export type StatusLoader = (
  id: string,
  signal?: AbortSignal,
) => Promise<Status>;

export const LOAD_STATUS = new InjectionToken<StatusLoader>('LOAD_STATUS', {
  providedIn: 'root',
  factory: () => async (id, signal) => {
    const response = await fetch(`/assets/statuses/${id}.json`, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load status ${id}: ${response.status}`);
    }
    return response.json();
  },
});

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  private readonly loadStatus = inject(LOAD_STATUS);
  private readonly state = inject(TransferState);
  private readonly server = isPlatformServer(inject(PLATFORM_ID));

  get(id: string, signal?: AbortSignal): Promise<Status> {
    return this.fetchStatus(id, signal);
  }

  getAll(ids: string[], signal?: AbortSignal): Promise<Status[]> {
    return Promise.all(ids.map(id => this.fetchStatus(id, signal)));
  }

  // Statuses loaded while server rendering are embedded in the page, so the browser needs no request.
  private async fetchStatus(id: string, signal?: AbortSignal): Promise<Status> {
    const key = makeStateKey<Status | undefined>(`status:${id}`);
    const embedded = this.state.get(key, undefined);
    if (embedded) {
      return embedded;
    }
    const status = await this.loadStatus(id, signal);
    if (this.server) {
      this.state.set(key, status);
    }
    return status;
  }
}
