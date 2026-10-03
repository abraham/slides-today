import { TestBed } from '@angular/core/testing';
import { DEFAULT_THEME, invert } from '../models/theme';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updates the current and inverted themes', () => {
    const theme = { backgroundColor: '#123456', color: '#abcdef' };
    service.update(theme);
    expect(service.current()).toEqual(theme);
    expect(service.inverted()).toEqual(invert(theme));
  });

  it('resets to the default theme', () => {
    service.update({ backgroundColor: '#123456', color: '#abcdef' });
    service.reset();
    expect(service.current()).toEqual(DEFAULT_THEME);
  });
});
