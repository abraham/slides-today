import { PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Status } from 'twitter-d';

import { LOAD_STATUS, TweetService } from './tweet.service';

describe('TweetService', () => {
  let service: TweetService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async (url: string) => ({
      ok: true,
      json: async () => ({ id_str: url }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetService);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetches a status by id', async () => {
    const signal = new AbortController().signal;

    expect(await service.get('1', signal)).toEqual({
      id_str: '/assets/statuses/1.json',
    });
    expect(fetchMock).toHaveBeenCalledWith('/assets/statuses/1.json', {
      signal,
    });
  });

  it('fetches every status in order', async () => {
    const statuses = await service.getAll(['1', '2']);

    expect(statuses.map(status => status.id_str)).toEqual([
      '/assets/statuses/1.json',
      '/assets/statuses/2.json',
    ]);
  });

  it('rejects when a status is not found', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(service.get('1')).rejects.toThrow('Failed to load status 1');
  });

  it('rejects when any status in a batch fails', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(service.getAll(['1', '2'])).rejects.toThrow();
  });

  it('uses a status embedded in the page without a request', async () => {
    const embedded = { id_str: 'embedded' } as Status;
    TestBed.inject(TransferState).set(
      makeStateKey<Status | null>('status:1'),
      embedded,
    );

    expect(await service.get('1')).toBe(embedded);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  describe('embedded', () => {
    const key = (id: string) => makeStateKey<Status | null>(`status:${id}`);

    it('returns the statuses embedded in the page, in order', () => {
      const state = TestBed.inject(TransferState);
      state.set(key('1'), { id_str: '1' } as Status);
      state.set(key('2'), { id_str: '2' } as Status);

      expect(service.embedded(['2', '1'])?.map(s => s.id_str)).toEqual([
        '2',
        '1',
      ]);
    });

    it('is undefined unless every status is embedded', () => {
      TestBed.inject(TransferState).set(key('1'), { id_str: '1' } as Status);

      expect(service.embedded(['1', '2'])).toBeUndefined();
    });

    it('is empty for a deck without tweets', () => {
      expect(service.embedded([])).toEqual([]);
    });
  });

  describe('while server rendering', () => {
    const loadStatus = vi.fn(async (id: string) => ({ id_str: id }) as Status);

    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: LOAD_STATUS, useValue: loadStatus },
        ],
      });
      service = TestBed.inject(TweetService);
    });

    it('embeds the loaded statuses in the page', async () => {
      await service.getAll(['1', '2']);

      const state = TestBed.inject(TransferState);
      expect(state.get(makeStateKey<Status | null>('status:1'), null)).toEqual({
        id_str: '1',
      });
      expect(state.get(makeStateKey<Status | null>('status:2'), null)).toEqual({
        id_str: '2',
      });
    });
  });

  it('does not embed statuses in the browser', async () => {
    await service.get('1');

    expect(
      TestBed.inject(TransferState).get(
        makeStateKey<Status | null>('status:1'),
        null,
      ),
    ).toBeNull();
  });
});
