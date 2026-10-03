import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Tag } from '../models/tag';
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

  describe('tags$', () => {
    it('is sorted by id', () => {
      const ids = service.tags$.value.map(tag => tag.id);

      expect(ids.length).toBeGreaterThan(1);
      expect(ids).toEqual([...ids].sort());
    });
  });

  describe('tagSelection', () => {
    it('adds a selected tag', () => {
      service.tagSelection({
        id: 'polymer',
        selected: true,
        updatePath: false,
      });

      expect(service.selectedTagIds$.value).toEqual(['polymer']);
    });

    it('does not duplicate a tag that is selected twice', () => {
      service.tagSelection({
        id: 'polymer',
        selected: true,
        updatePath: false,
      });
      service.tagSelection({
        id: 'polymer',
        selected: true,
        updatePath: false,
      });

      expect(service.selectedTagIds$.value).toEqual(['polymer']);
    });

    it('removes a deselected tag', () => {
      service.tagSelection({
        id: 'polymer',
        selected: true,
        updatePath: false,
      });
      service.tagSelection({ id: 'php', selected: true, updatePath: false });
      service.tagSelection({
        id: 'polymer',
        selected: false,
        updatePath: false,
      });

      expect(service.selectedTagIds$.value).toEqual(['php']);
    });
  });

  describe('path$', () => {
    it('emits the selected tag ids when updatePath is true', () => {
      const paths: string[][] = [];
      service.path$.subscribe(path => paths.push(path));

      service.tagSelection({ id: 'polymer', selected: true, updatePath: true });

      expect(paths).toEqual([['polymer']]);
    });

    it('does not emit when updatePath is false', () => {
      const paths: string[][] = [];
      service.path$.subscribe(path => paths.push(path));

      service.tagSelection({
        id: 'polymer',
        selected: true,
        updatePath: false,
      });

      expect(paths).toEqual([]);
    });
  });

  describe('filterTags$', () => {
    it('returns all tags when no ids are given', async () => {
      expect(await firstValueFrom(service.filterTags$([]))).toEqual(
        service.tags$.value,
      );
    });

    it('returns only the tags matching the ids', async () => {
      const tags = await firstValueFrom(
        service.filterTags$(['polymer', 'php']),
      );

      expect(tags.map(tag => tag.id)).toEqual(['php', 'polymer']);
    });
  });

  describe('tag$', () => {
    it('returns the tag with the id', async () => {
      const tag: Tag | undefined = await firstValueFrom(
        service.tag$('polymer'),
      );

      expect(tag?.id).toBe('polymer');
    });

    it('returns undefined for an unknown id', async () => {
      expect(await firstValueFrom(service.tag$('unknown'))).toBeUndefined();
    });
  });
});
