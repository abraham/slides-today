import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Speaker } from './speaker';
import speakers from './speakers.data.json';
import { find } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpeakerService {
  get(id: string): Observable<Speaker> {
    return from(speakers).pipe(
      find((speaker: Speaker) => speaker.id === id)
    );
  }
}
