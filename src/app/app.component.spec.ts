import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { EMPTY } from 'rxjs';
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
          { path: '**', component: StubComponent },
        ]),
        { provide: SwUpdate, useValue: { versionUpdates: EMPTY } },
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
});
