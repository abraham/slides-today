import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly availableState = signal(false);

  readonly available = this.availableState.asReadonly();

  constructor() {
    const subscription = inject(SwUpdate).versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        this.availableState.set(true);
      }
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }
}
