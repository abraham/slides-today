import { TestBed } from '@angular/core/testing';
import tagData from '../tags.data.json';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tags', () => {
    it('is sorted by id', () => {
      const ids = service.tags.map(tag => tag.id);

      expect(ids.length).toBeGreaterThan(1);
      expect(ids).toEqual([...ids].sort());
    });

    it('does not reorder the imported tag data', () => {
      const ids = tagData.map(tag => tag.id);

      expect(ids).not.toEqual([...ids].sort());
    });
  });

  describe('tagSelection', () => {
    it('adds a selected tag', () => {
      service.tagSelection({ id: 'polymer', selected: true });

      expect(service.selectedTagIds()).toEqual(['polymer']);
    });

    it('keeps tags in selection order', () => {
      service.tagSelection({ id: 'polymer', selected: true });
      service.tagSelection({ id: 'php', selected: true });

      expect(service.selectedTagIds()).toEqual(['polymer', 'php']);
    });

    it('does not duplicate a tag that is selected twice', () => {
      service.tagSelection({ id: 'polymer', selected: true });
      service.tagSelection({ id: 'polymer', selected: true });

      expect(service.selectedTagIds()).toEqual(['polymer']);
    });

    it('removes a deselected tag', () => {
      service.tagSelection({ id: 'polymer', selected: true });
      service.tagSelection({ id: 'php', selected: true });
      service.tagSelection({ id: 'polymer', selected: false });

      expect(service.selectedTagIds()).toEqual(['php']);
    });
  });

  describe('filterTags', () => {
    it('returns all tags when no ids are given', () => {
      expect(service.filterTags([])).toEqual(service.tags);
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
