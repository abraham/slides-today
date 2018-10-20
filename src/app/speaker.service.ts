import { Injectable } from '@angular/core';
import { Speaker } from './speaker';
import speakers from './speakers.data.json';

const SPEAKERS = speakers as Speaker[];

@Injectable()
export class SpeakerService {
  getSpeakers(): Promise<Speaker[]> {
    return Promise.resolve(SPEAKERS);
  }

  getSpeaker(id: string): Promise<Speaker> {
    return Promise.resolve(SPEAKERS.find(speaker => speaker.id === id));
  }
}
