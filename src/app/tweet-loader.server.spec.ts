import { readStatus } from './tweet-loader.server';

describe('readStatus', () => {
  it('loads a bundled status by id', async () => {
    const status = await readStatus('1006928289578078208');

    expect(status.id_str).toBe('1006928289578078208');
  });

  it('rejects an id that is not a number', async () => {
    await expect(readStatus('../decks.data')).rejects.toThrow(
      'Invalid status id',
    );
  });

  it('rejects an unknown status', async () => {
    await expect(readStatus('1')).rejects.toThrow();
  });
});
