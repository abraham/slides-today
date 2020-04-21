import { Injectable } from '@angular/core';
import { from, NEVER, Observable } from 'rxjs';
import { find } from 'rxjs/operators';
import { Speaker } from '../models/speaker';
import speakers from '../speakers.data.json';

@Injectable({
  providedIn: 'root',
})
export class SpeakerService {
  get(id?: string | null): Observable<Speaker | undefined> {
    if (!id) {
      return NEVER;
    }

    return from(speakers as Speaker[]).pipe(
      find((speaker: Speaker) => speaker.id === id),
    );
  }
}
