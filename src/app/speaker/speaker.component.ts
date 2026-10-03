import { Component, computed, inject, input } from '@angular/core';
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
  readonly speaker = computed(() => this.speakerService.get(this.speakerId()));
}
