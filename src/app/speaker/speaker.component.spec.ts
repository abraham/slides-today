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
});
