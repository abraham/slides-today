import { TestBed } from '@angular/core/testing';

import sponsors from '../sponsors.data.json';
import { SponsorService } from './sponsor.service';

describe('SponsorService', () => {
  let service: SponsorService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SponsorService);
    await service.loaded;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('selects only the sponsors with the ids', () => {
    const selected = service.select([sponsors[0].id, 'unknown']);

    expect(selected.map(sponsor => sponsor.id)).toEqual([sponsors[0].id]);
  });

  it('returns no sponsors for no ids', () => {
    expect(service.select([])).toEqual([]);
  });
});
