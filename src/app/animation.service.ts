import { Injectable } from '@angular/core';
import { Position } from './position';

@Injectable()
export class AnimationService {
  private position: Position;

  constructor() {}

  set startPosition(position: Position) {
    this.position = position;
  }

  get startPosition(): Position {
    return this.position;
  }
}
