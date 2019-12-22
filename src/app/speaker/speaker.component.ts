import { Component, Input } from '@angular/core';
import { SpeakerService } from '../speaker.service';

@Component({
  selector: 'app-speaker',
  styleUrls: ['./speaker.component.scss'],
  templateUrl: './speaker.component.html',
})
export class SpeakerComponent {
  constructor(public speakerService: SpeakerService) {}

  @Input() speakerId?: string;
}
