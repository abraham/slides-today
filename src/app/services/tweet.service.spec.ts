import { TestBed } from '@angular/core/testing';

import { TweetService } from './tweet.service';

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
});
