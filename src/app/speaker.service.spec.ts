import { TestBed } from '@angular/core/testing';

import { SpeakersService } from './speakers.service';

describe('SpeakersService', () => {
  let service: SpeakersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeakersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
