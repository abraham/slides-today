import { Component } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { AnalyticsService } from './analytics.service';

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => 'analytics'),
  logEvent: vi.fn(),
}));
vi.mock('firebase/performance', () => ({ getPerformance: vi.fn() }));

@Component({ template: '' })
class StubComponent {}

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    });
    service = TestBed.inject(AnalyticsService);
  });

  const loadFirebase = async (): Promise<void> => {
    TestBed.inject(ApplicationRef).tick();
    await vi.waitFor(() => expect(logEvent).toHaveBeenCalled());
  };

  it('does not load Firebase before the first render', () => {
    service.init();

    expect(initializeApp).not.toHaveBeenCalled();
  });

  it('initializes Firebase after the first render', async () => {
    service.init();
    await TestBed.inject(Router).navigateByUrl('/a');

    await loadFirebase();

    expect(initializeApp).toHaveBeenCalled();
    expect(getAnalytics).toHaveBeenCalled();
    expect(getPerformance).toHaveBeenCalled();
  });

  it('logs a navigation that finished before Firebase loaded', async () => {
    service.init();
    await TestBed.inject(Router).navigateByUrl('/a');

    await loadFirebase();

    expect(logEvent).toHaveBeenCalledWith('analytics', 'screen_view', {
      firebase_screen: '/a',
      firebase_screen_class: 'AppComponent',
    });
  });

  it('logs later navigations', async () => {
    service.init();
    await TestBed.inject(Router).navigateByUrl('/a');
    await loadFirebase();

    await TestBed.inject(Router).navigateByUrl('/b');

    expect(logEvent).toHaveBeenLastCalledWith('analytics', 'screen_view', {
      firebase_screen: '/b',
      firebase_screen_class: 'AppComponent',
    });
  });
});
