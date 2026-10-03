import {
  DestroyRef,
  Injectable,
  Injector,
  afterNextRender,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  // Kept so a navigation that finishes before Firebase loads is still logged.
  private currentScreen?: string;
  private logScreen?: (screen: string) => void;

  /** Loads Firebase after the first render so it stays out of the initial bundle and render path. */
  init(): void {
    const subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentScreen = event.urlAfterRedirects;
        this.logScreen?.(this.currentScreen);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
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
    this.logScreen = screen =>
      logEvent(analytics, 'screen_view', {
        firebase_screen: screen,
        firebase_screen_class: 'AppComponent',
      });
    if (this.currentScreen) {
      this.logScreen(this.currentScreen);
    }
  }
}
