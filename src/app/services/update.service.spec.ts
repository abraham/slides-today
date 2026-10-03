import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SwUpdate,
  UnrecoverableStateEvent,
  VersionEvent,
} from '@angular/service-worker';

import { UpdateService } from './update.service';

describe('UpdateService', () => {
  let service: UpdateService;
  let versionUpdates: EventEmitter<VersionEvent>;
  let unrecoverable: EventEmitter<UnrecoverableStateEvent>;
  let checkForUpdate: ReturnType<typeof vi.fn>;

  const setup = (isEnabled: boolean) => {
    versionUpdates = new EventEmitter<VersionEvent>();
    unrecoverable = new EventEmitter<UnrecoverableStateEvent>();
    checkForUpdate = vi.fn(() => Promise.resolve(false));
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SwUpdate,
          useValue: {
            versionUpdates,
            unrecoverable,
            isEnabled,
            checkForUpdate,
          },
        },
      ],
    });
    service = TestBed.inject(UpdateService);
  };

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('with the service worker disabled', () => {
    beforeEach(() => setup(false));

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

    it('becomes available when the worker is in an unrecoverable state', () => {
      unrecoverable.emit({ type: 'UNRECOVERABLE_STATE', reason: 'hash' });

      expect(service.available()).toBe(true);
    });

    it('never checks for updates', () => {
      document.dispatchEvent(new Event('visibilitychange'));

      expect(checkForUpdate).not.toHaveBeenCalled();
    });
  });

  describe('with the service worker enabled', () => {
    const visibility = (state: DocumentVisibilityState) =>
      vi.spyOn(document, 'visibilityState', 'get').mockReturnValue(state);

    it('checks for an update when the page becomes visible', () => {
      setup(true);
      visibility('visible');

      document.dispatchEvent(new Event('visibilitychange'));

      expect(checkForUpdate).toHaveBeenCalledTimes(1);
    });

    it('does not check when the page is hidden', () => {
      setup(true);
      visibility('hidden');

      document.dispatchEvent(new Event('visibilitychange'));

      expect(checkForUpdate).not.toHaveBeenCalled();
    });

    it('checks for an update every hour', () => {
      vi.useFakeTimers();
      setup(true);

      vi.advanceTimersByTime(60 * 60 * 1000);
      vi.advanceTimersByTime(60 * 60 * 1000);

      expect(checkForUpdate).toHaveBeenCalledTimes(2);
    });

    it('ignores a failed check', async () => {
      setup(true);
      checkForUpdate.mockRejectedValue(new Error('offline'));
      visibility('visible');

      document.dispatchEvent(new Event('visibilitychange'));

      await expect(checkForUpdate.mock.results[0].value).rejects.toThrow();
      expect(service.available()).toBe(false);
    });

    it('stops checking once destroyed', () => {
      setup(true);
      visibility('visible');
      TestBed.resetTestingModule();

      document.dispatchEvent(new Event('visibilitychange'));

      expect(checkForUpdate).not.toHaveBeenCalled();
    });
  });
});
