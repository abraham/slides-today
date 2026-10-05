import { RESPONSE_INIT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ThemeService } from '../services/theme.service';

import { NotFoundComponent } from './not-found.component';
import { DEFAULT_THEME } from '../models/theme';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.inject(ThemeService).update({
      backgroundColor: '#123456',
      color: '#abcdef',
    });
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the default message', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain(
      'Page Not Found',
    );
  });

  it('shows a custom message', () => {
    fixture.componentRef.setInput('text', 'No such deck');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain(
      'No such deck',
    );
  });

  it('sets the page title', () => {
    expect(TestBed.inject(Title).getTitle()).toBe(
      'Page not found | Slides.today',
    );
  });

  it('resets the theme of the previous page', () => {
    expect(TestBed.inject(ThemeService).current()).toEqual(DEFAULT_THEME);
  });

  it('sets the response status to 404 while server rendering', () => {
    const response = { status: 200 };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: RESPONSE_INIT, useValue: response }],
    });

    TestBed.createComponent(NotFoundComponent);

    expect(response.status).toBe(404);
  });
});
