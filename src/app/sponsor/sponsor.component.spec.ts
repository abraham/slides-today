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

  it('lists no sponsors without ids', () => {
    expect(
      fixture.nativeElement.querySelectorAll('a[mat-list-item]').length,
    ).toBe(0);
  });

  it('links to the sponsor in a new tab', () => {
    fixture.componentRef.setInput('sponsorIds', [sponsors[0].id]);
    fixture.detectChanges();

    const link: HTMLAnchorElement =
      fixture.nativeElement.querySelector('a[mat-list-item]');
    expect(link.getAttribute('href')).toBe(sponsors[0].url);
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener');
  });
});
