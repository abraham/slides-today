import {
  DestroyRef,
  Injectable,
  Injector,
  afterNextRender,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  // Replays the current page so a navigation that finishes before Firebase loads is still logged.
  private readonly screens$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  /** Loads Firebase after the first render so it stays out of the initial bundle and render path. */
  init(): void {
    this.screens$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    afterNextRender(() => this.load(), { injector: this.injector });
  }

  private async load(): Promise<void> {
    const [{ initializeApp }, { getAnalytics, logEvent }, { getPerformance }] =
      await Promise.all([
        import('firebase/app'),
        import('firebase/analytics'),
        import('firebase/performance'),
      ]);
    const app = initializeApp(environment.firebase);
    const analytics = getAnalytics(app);
    getPerformance(app);
    this.screens$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(url =>
      logEvent(analytics, 'screen_view', {
        firebase_screen: url,
        firebase_screen_class: 'AppComponent',
      }),
    );
  }
}
