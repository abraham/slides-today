import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpeakerComponent } from './speaker.component';

describe('SpeakerComponent', () => {
  let component: SpeakerComponent;
  let fixture: ComponentFixture<SpeakerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SpeakerComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
