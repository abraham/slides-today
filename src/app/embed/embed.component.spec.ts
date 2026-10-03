import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedComponent } from './embed.component';

describe('EmbedComponent', () => {
  let component: EmbedComponent;
  let fixture: ComponentFixture<EmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmbedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('link', {
      title: 'Slides',
      url: 'https://docs.google.com/presentation/d/abc',
      useAsTag: false,
      service: 'slides',
    });
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('enables the embed only when the button is activated', () => {
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector('.action')!.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();
    expect(element.querySelector('iframe')).toBeNull();

    element.querySelector('button')!.click();
    fixture.detectChanges();
    expect(element.querySelector('iframe')).not.toBeNull();
  });
});
