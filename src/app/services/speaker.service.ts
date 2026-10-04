import { Injectable } from '@angular/core';
import { Speaker } from '../models/speaker';
import speakers from '../speakers.data.json';

@Injectable({
  providedIn: 'root',
})
export class SpeakerService {
  readonly speakers = [...(speakers as Speaker[])].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  get(id?: string | null): Speaker | undefined {
    return (speakers as Speaker[]).find(speaker => speaker.id === id);
  }
}
