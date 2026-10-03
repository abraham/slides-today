import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('encodes the location in the place url', () => {
    fixture.componentRef.setInput('location', 'Portland, OR/US?');

    expect(component.url()).toBe(
      'https://www.google.com/maps/place/Portland%2C%20OR%2FUS%3F/',
    );
  });

  it('builds a static map url centered on the encoded location', () => {
    fixture.componentRef.setInput('location', 'Portland, OR');

    const url = new URL(component.mapUrl());
    expect(url.origin + url.pathname).toBe(
      'https://maps.googleapis.com/maps/api/staticmap',
    );
    expect(url.searchParams.get('center')).toBe('Portland, OR');
    expect(url.searchParams.get('key')).toBe(environment.googleMaps.key);
  });

  it('shows the location', () => {
    fixture.componentRef.setInput('location', 'Portland, OR');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Portland, OR');
  });
});
