import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

const CHECK_INTERVAL_MS = 60 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly availableState = signal(false);

  readonly available = this.availableState.asReadonly();

  constructor() {
    const swUpdate = inject(SwUpdate);
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    const subscriptions = [
      swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.availableState.set(true);
        }
      }),
      // The worker can no longer serve a consistent version, so only a reload recovers.
      swUpdate.unrecoverable.subscribe(() => this.availableState.set(true)),
    ];
    destroyRef.onDestroy(() =>
      subscriptions.forEach(subscription => subscription.unsubscribe()),
    );

    if (swUpdate.isEnabled) {
      // Browsers only look for a new worker on navigation, which long-lived tabs and installed apps rarely do.
      const check = () => swUpdate.checkForUpdate().catch(() => false);
      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          check();
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange);
      const timer = setInterval(check, CHECK_INTERVAL_MS);
      destroyRef.onDestroy(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
        clearInterval(timer);
      });
    }
  }
}
