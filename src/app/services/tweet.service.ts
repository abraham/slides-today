import { Injectable } from '@angular/core';
import type { Status } from 'twitter-d';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  get(id: string, signal?: AbortSignal): Promise<Status> {
    return this.fetchStatus(id, signal);
  }

  getAll(ids: string[], signal?: AbortSignal): Promise<Status[]> {
    return Promise.all(ids.map(id => this.fetchStatus(id, signal)));
  }

  private async fetchStatus(id: string, signal?: AbortSignal): Promise<Status> {
    const response = await fetch(`/assets/statuses/${id}.json`, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load status ${id}: ${response.status}`);
    }
    return response.json();
  }
}
