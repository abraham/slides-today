import { TagListPipe } from './tag-list.pipe';

describe('TagListPipe', () => {
  it('formats tags', async () => {
    const pipe = new TagListPipe();
    expect(await pipe.transform(null)).toEqual('');
    expect(await pipe.transform([])).toEqual('');
    expect(await pipe.transform(['one'])).toEqual('#one');
    expect(await pipe.transform(['one', 'two'])).toEqual('#one and #two');
    expect(await pipe.transform(['one', 'two', 'three'])).toEqual(
      '#one, #two, and #three',
    );
  });
});
