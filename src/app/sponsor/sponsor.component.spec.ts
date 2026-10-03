import { ComponentFixture, TestBed } from '@angular/core/testing';

import sponsors from '../sponsors.data.json';
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

  it('renders only the sponsors for the given ids', async () => {
    fixture.componentRef.setInput('sponsorIds', [sponsors[0].id]);
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain(sponsors[0].name);
    expect(text).not.toContain(sponsors[1].name);
  });
});
