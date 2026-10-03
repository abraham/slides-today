import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckResourcesComponent } from './deck-resources.component';

describe('DeckResourcesComponent', () => {
  let component: DeckResourcesComponent;
  let fixture: ComponentFixture<DeckResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckResourcesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders no links without resources', () => {
    expect(fixture.nativeElement.querySelectorAll('a').length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Resources');
  });

  it('links to each resource in a new tab', () => {
    fixture.componentRef.setInput('resources', [
      { title: 'Docs', url: 'https://example.com/docs' },
      { title: 'Source', url: 'https://example.com/source' },
    ]);
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('a'),
    );
    expect(links.map(link => link.textContent?.trim())).toEqual([
      expect.stringContaining('Docs'),
      expect.stringContaining('Source'),
    ]);
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      'https://example.com/docs',
      'https://example.com/source',
    ]);
    links.forEach(link => {
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener');
    });
  });
});
