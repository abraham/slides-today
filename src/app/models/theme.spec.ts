import { themeTokens } from './theme';

describe('themeTokens', () => {
  const theme = { backgroundColor: '#123456', color: '#abcdef' };

  it('gives surfaces the background color and text the foreground color', () => {
    const tokens = themeTokens(theme);

    expect(tokens['--mat-sys-surface']).toBe('#123456');
    expect(tokens['--mat-sys-surface-container-low']).toBe('#123456');
    expect(tokens['--mat-sys-on-surface']).toBe('#abcdef');
  });

  it('inverts the colors for primary roles', () => {
    const tokens = themeTokens(theme);

    expect(tokens['--mat-sys-primary']).toBe('#abcdef');
    expect(tokens['--mat-sys-primary-container']).toBe('#abcdef');
    expect(tokens['--mat-sys-on-primary']).toBe('#123456');
    expect(tokens['--mat-sys-on-primary-container']).toBe('#123456');
  });
});
