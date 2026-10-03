import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { SpeakerService } from '../services/speaker.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-speaker',
  styleUrls: ['./speaker.component.scss'],
  templateUrl: './speaker.component.html',
  imports: [CardComponent],
})
export class SpeakerComponent {
  private speakerService = inject(SpeakerService);

  readonly speakerId = input<string>();
  readonly speaker = toSignal(
    toObservable(this.speakerId).pipe(
      switchMap(id => this.speakerService.get(id)),
    ),
  );
}
