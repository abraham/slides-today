import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

import { UpdateService } from './update.service';

describe('UpdateService', () => {
  let service: UpdateService;
  let versionUpdates: EventEmitter<VersionEvent>;

  beforeEach(() => {
    versionUpdates = new EventEmitter<VersionEvent>();
    TestBed.configureTestingModule({
      providers: [{ provide: SwUpdate, useValue: { versionUpdates } }],
    });
    service = TestBed.inject(UpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('is not available before an update is ready', () => {
    expect(service.available()).toBe(false);
  });

  it('becomes available when a version is ready', () => {
    versionUpdates.emit({
      type: 'VERSION_READY',
      currentVersion: { hash: 'a' },
      latestVersion: { hash: 'b' },
    });

    expect(service.available()).toBe(true);
  });

  it('ignores other version events', () => {
    versionUpdates.emit({
      type: 'VERSION_DETECTED',
      version: { hash: 'b' },
    });

    expect(service.available()).toBe(false);
  });
});
