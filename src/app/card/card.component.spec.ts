import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `<app-card><div title>Only a title</div></app-card>`,
})
class TitleOnlyHostComponent {}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides the headings for content slots that are not used', () => {
    const host = TestBed.createComponent(TitleOnlyHostComponent);
    host.detectChanges();
    const display = (selector: string): string =>
      getComputedStyle(host.nativeElement.querySelector(selector)).display;

    expect(display('.title')).not.toBe('none');
    expect(display('.hero')).toBe('none');
    expect(display('.subtitle')).toBe('none');
  });
});
