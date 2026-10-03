import { ComponentFixture, TestBed } from '@angular/core/testing';

import speakers from '../speakers.data.json';
import { SpeakerComponent } from './speaker.component';

describe('SpeakerComponent', () => {
  let component: SpeakerComponent;
  let fixture: ComponentFixture<SpeakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeakerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('speakerId', speakers[0].id);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('renders the speaker for the given id', async () => {
    fixture.componentRef.setInput('speakerId', speakers[0].id);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain(speakers[0].name);
  });

  it('links to the speaker profiles in new tabs', () => {
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('mat-card-actions a'),
    );
    expect(links.map(link => link.getAttribute('href'))).toEqual(
      speakers[0].links.map(link => link.url),
    );
  });

  it('renders nothing for an unknown speaker', () => {
    fixture.componentRef.setInput('speakerId', 'unknown');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-card')).toBeNull();
  });
});
