import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import tagData from '../tags.data.json';
import { DataService } from './data.service';

@Component({ template: '' })
class StubComponent {}

describe('DataService', () => {
  let service: DataService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: StubComponent }])],
    });
    service = TestBed.inject(DataService);
    await service.loaded;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tags', () => {
    it('is sorted by id', () => {
      const ids = service.tags().map(tag => tag.id);

      expect(ids.length).toBeGreaterThan(1);
      expect(ids).toEqual([...ids].sort());
    });

    it('does not reorder the imported tag data', () => {
      const ids = tagData.map(tag => tag.id);

      expect(ids).not.toEqual([...ids].sort());
    });
  });

  describe('selectedTagIds', () => {
    const navigate = (url: string) => TestBed.inject(Router).navigateByUrl(url);

    it('is empty before any navigation', () => {
      expect(service.selectedTagIds()).toEqual([]);
    });

    it('is the tags param of the tags url, in order', async () => {
      await navigate('/filters?tags=polymer,php');

      expect(service.selectedTagIds()).toEqual(['polymer', 'php']);
    });

    it('follows later navigations', async () => {
      await navigate('/filters?tags=polymer,php');
      await navigate('/filters?tags=php');
      expect(service.selectedTagIds()).toEqual(['php']);

      await navigate('/');
      expect(service.selectedTagIds()).toEqual([]);
    });

    it('is empty on other pages even with a tags param', async () => {
      await navigate('/decks/abc;tags=polymer');

      expect(service.selectedTagIds()).toEqual([]);
    });

    it('ignores an empty tags param', async () => {
      await navigate('/filters?tags=');

      expect(service.selectedTagIds()).toEqual([]);
    });
  });

  describe('selectedSpeakerIds', () => {
    const navigate = (url: string) => TestBed.inject(Router).navigateByUrl(url);

    it('is the speakers param of the filters url, in order', async () => {
      await navigate('/filters?speakers=a,b&tags=php');

      expect(service.selectedSpeakerIds()).toEqual(['a', 'b']);
      expect(service.selectedTagIds()).toEqual(['php']);
    });

    it('is empty on other pages', async () => {
      await navigate('/?speakers=a');

      expect(service.selectedSpeakerIds()).toEqual([]);
    });
  });

  describe('selectedEventIds', () => {
    const navigate = (url: string) => TestBed.inject(Router).navigateByUrl(url);

    it('is the events param of the filters url, in order', async () => {
      await navigate('/filters?events=a,b&tags=php');

      expect(service.selectedEventIds()).toEqual(['a', 'b']);
      expect(service.selectedTagIds()).toEqual(['php']);
    });

    it('is empty on other pages', async () => {
      await navigate('/?events=a');

      expect(service.selectedEventIds()).toEqual([]);
    });
  });

  describe('setFilter', () => {
    const navigate = (url: string) => TestBed.inject(Router).navigateByUrl(url);

    it('keeps the events param when another filter is cleared', async () => {
      await navigate('/filters?events=a&tags=php');
      const spy = vi.spyOn(TestBed.inject(Router), 'navigate');

      service.setFilter('tags', []);

      expect(spy).toHaveBeenCalledWith(['/filters'], {
        queryParams: { tags: null },
        queryParamsHandling: 'merge',
      });
    });

    it('goes home when the last filter is cleared', async () => {
      await navigate('/filters?events=a');
      const spy = vi.spyOn(TestBed.inject(Router), 'navigate');

      service.setFilter('events', []);

      expect(spy).toHaveBeenCalledWith(['/']);
    });
  });

  describe('filterTags', () => {
    it('returns all tags when no ids are given', () => {
      expect(service.filterTags([])).toEqual(service.tags());
    });

    it('returns only the tags matching the ids', () => {
      const tags = service.filterTags(['polymer', 'php']);

      expect(tags.map(tag => tag.id)).toEqual(['php', 'polymer']);
    });
  });

  describe('tag', () => {
    it('returns the tag with the id', () => {
      expect(service.tag('polymer')?.id).toBe('polymer');
    });

    it('returns undefined for an unknown id', () => {
      expect(service.tag('unknown')).toBeUndefined();
    });
  });
});
