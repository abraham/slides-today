import { Injectable, computed, inject, signal } from '@angular/core';
import { Speaker } from '../models/speaker';
import { SPEAKERS } from '../repositories';

@Injectable({
  providedIn: 'root',
})
export class SpeakerService {
  private readonly speakersState = signal<Speaker[]>([]);

  readonly loaded = inject(SPEAKERS)
    .list()
    .then(speakers => {
      this.speakersState.set(speakers);
    });

  readonly speakers = computed(() =>
    [...this.speakersState()].sort((a, b) => a.name.localeCompare(b.name)),
  );

  get(id?: string | null): Speaker | undefined {
    return this.speakersState().find(speaker => speaker.id === id);
  }
}
