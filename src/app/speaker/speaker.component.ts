import { Component, Input } from '@angular/core';
import { SpeakerService } from '../services/speaker.service';

@Component({
  selector: 'app-speaker',
  styleUrls: ['./speaker.component.scss'],
  templateUrl: './speaker.component.html',
})
export class SpeakerComponent {
  @Input() speakerId?: string;

  constructor(public speakerService: SpeakerService) {}
}
