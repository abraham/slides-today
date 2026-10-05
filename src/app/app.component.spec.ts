import {
  Component,
  EnvironmentInjector,
  EventEmitter,
  createComponent,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { AppComponent } from './app.component';

@Component({ template: '' })
class StubComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          {
            path: 'details',
            component: StubComponent,
            data: { showBack: true, headerTitle: '' },
          },
          { path: 'lazy', loadComponent: () => Promise.resolve(StubComponent) },
          { path: '**', component: StubComponent },
        ]),
        {
          provide: SwUpdate,
          useValue: {
            versionUpdates: new EventEmitter(),
            unrecoverable: new EventEmitter(),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have the default title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title()).toEqual('Slides.today');
  });

  it('should render the header', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-header')).toBeTruthy();
  });

  it('uses the route data for the back button and title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/details');

    expect(fixture.componentInstance.showBack()).toBe(true);
    expect(fixture.componentInstance.title()).toBe('');
  });

  it('falls back to the defaults for routes without data', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/details');
    await TestBed.inject(Router).navigateByUrl('/other');

    expect(fixture.componentInstance.showBack()).toBe(false);
    expect(fixture.componentInstance.title()).toBe('Slides.today');
  });

  it('removes the noscript fallback', () => {
    const noscript = document.createElement('noscript');
    document.body.append(noscript);

    TestBed.createComponent(AppComponent);

    expect(noscript.isConnected).toBe(false);
  });

  it('shows the loading skeleton until the first lazy route has loaded', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const skeleton = () =>
      fixture.nativeElement.querySelector('ngx-skeleton-loader');
    expect(skeleton()).not.toBeNull();

    await TestBed.inject(Router).navigateByUrl('/lazy');
    fixture.detectChanges();

    expect(fixture.componentInstance.firstLoad()).toBe(false);
    expect(skeleton()).toBeNull();
  });

  it('has no loading skeleton when the server rendered the page', () => {
    const hostElement = document.createElement('app-root');
    hostElement.setAttribute('ng-server-context', 'ssg');
    const ref = createComponent(AppComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
      hostElement,
    });
    ref.changeDetectorRef.detectChanges();

    expect(ref.instance.firstLoad()).toBe(false);
    expect(hostElement.querySelector('ngx-skeleton-loader')).toBeNull();
  });
});
