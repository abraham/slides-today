import { Component, Input } from '@angular/core';
import { SpeakerService } from '../services/speaker.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-speaker',
  styleUrls: ['./speaker.component.scss'],
  templateUrl: './speaker.component.html',
  imports: [NgIf, CardComponent, AsyncPipe],
})
export class SpeakerComponent {
  @Input() speakerId?: string;

  constructor(public speakerService: SpeakerService) {}
}
