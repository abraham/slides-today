import { TagListPipe } from './tag-list.pipe';

describe('TagListPipe', () => {
  it('create an instance', () => {
    const pipe = new TagListPipe();
    expect(pipe).toBeTruthy();
  });

  it('formats tags synchronously', () => {
    const pipe = new TagListPipe();
    expect(pipe.transform(['angular', 'pwa'])).toEqual('#angular and #pwa');
    expect(pipe.transform(null)).toEqual('');
  });
});
