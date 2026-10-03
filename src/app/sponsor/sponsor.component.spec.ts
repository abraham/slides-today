import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorComponent } from './sponsor.component';

describe('SponsorComponent', () => {
  let component: SponsorComponent;
  let fixture: ComponentFixture<SponsorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sponsorIds', []);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
