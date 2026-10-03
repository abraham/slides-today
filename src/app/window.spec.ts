import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { WINDOW } from './window';

describe('WINDOW', () => {
  it('is the window of the document', () => {
    expect(TestBed.inject(WINDOW)).toBe(window);
  });

  it('throws when the document has no window', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: null } }],
    });

    expect(() => TestBed.inject(WINDOW)).toThrow(
      'WINDOW requires a browser environment.',
    );
  });
});
