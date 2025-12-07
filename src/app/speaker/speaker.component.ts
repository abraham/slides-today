import { Component, Input, inject } from '@angular/core';
import { SpeakerService } from '../services/speaker.service';
import { CardComponent } from '../card/card.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-speaker',
  styleUrls: ['./speaker.component.scss'],
  templateUrl: './speaker.component.html',
  imports: [CardComponent, AsyncPipe],
})
export class SpeakerComponent {
  speakerService = inject(SpeakerService);

  @Input() speakerId?: string;
}
