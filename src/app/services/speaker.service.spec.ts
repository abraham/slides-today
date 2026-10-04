import { TestBed } from '@angular/core/testing';

import speakers from '../speakers.data.json';
import { SpeakerService } from './speaker.service';

describe('SpeakerService', () => {
  let service: SpeakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('lists the speakers sorted by name', () => {
    const names = service.speakers.map(speaker => speaker.name);

    expect(names.length).toBe(speakers.length);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('returns the speaker with the id', () => {
    expect(service.get(speakers[0].id)?.name).toBe(speakers[0].name);
  });

  it('returns undefined for a missing or unknown id', () => {
    expect(service.get(undefined)).toBeUndefined();
    expect(service.get(null)).toBeUndefined();
    expect(service.get('unknown')).toBeUndefined();
  });
});
