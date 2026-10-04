import { TestBed } from '@angular/core/testing';

import Data from '../decks.data.json';
import { DeckService } from './deck.service';

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('has no decks until the data has loaded', async () => {
    expect(service.decks()).toBeUndefined();
    expect(service.filter([])).toBeUndefined();

    await service.get('unknown');

    expect(service.decks()).toBeDefined();
  });

  it('loads the unarchived decks', async () => {
    const { id } = Data.find(deck => !deck.archived)!;
    const archived = Data.find(deck => deck.archived)!;

    expect((await service.get(id))?.id).toBe(id);
    expect(await service.get(archived.id)).toBeUndefined();
    expect(service.decks()?.length).toBe(
      Data.filter(deck => !deck.archived).length,
    );
  });

  it('returns undefined for an unknown deck', async () => {
    expect(await service.get('unknown')).toBeUndefined();
    expect(await service.get(null)).toBeUndefined();
  });

  it('finds a deck by its legacy id', async () => {
    const { id, legacyId } = Data.find(deck => !deck.archived)!;

    expect((await service.getByLegacyId(legacyId))?.id).toBe(id);
    expect(await service.getByLegacyId(id)).toBeUndefined();
    expect(await service.getByLegacyId(null)).toBeUndefined();
  });

  it('filters decks that include all of the tags', async () => {
    await service.get('unknown');
    const [tag] = service.decks()![0].tags;
    const decks = service.filter([tag])!;

    expect(decks.length).toBeGreaterThan(0);
    expect(decks.every(deck => deck.tags.includes(tag))).toBe(true);
    expect(service.filter(['unknown'])).toEqual([]);
  });

  it('filters decks that include all of the speakers', async () => {
    await service.get('unknown');
    const [speaker] = service.decks()!.flatMap(deck => deck.speakerIds);
    const decks = service.filter([], [speaker!])!;

    expect(decks.length).toBeGreaterThan(0);
    expect(decks.every(deck => deck.speakerIds.includes(speaker!))).toBe(true);
    expect(service.filter([], ['unknown'])).toEqual([]);
  });

  it('filters decks that include all of the events', async () => {
    await service.get('unknown');
    const [eventId] = service.decks()![0].eventIds;
    const decks = service.filter([], [], [eventId!])!;

    expect(decks.length).toBeGreaterThan(0);
    expect(decks.every(deck => deck.eventIds.includes(eventId!))).toBe(true);
    expect(service.filter([], [], ['unknown'])).toEqual([]);
  });

  it('returns all decks without tags', async () => {
    await service.get('unknown');

    expect(service.filter([])).toEqual(service.decks());
  });
});
