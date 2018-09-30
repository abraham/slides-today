import { Component, Input, OnInit } from '@angular/core';
import { Speaker } from '../speaker';
import { SpeakerService } from '../speaker.service';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss'],
  providers: [SpeakerService],
})
export class SpeakerComponent implements OnInit {
  constructor(private speakerService: SpeakerService) { }

  @Input() id?: string;

  speaker?: Speaker;

  ngOnInit() {
    if (this.id) {
      this.speakerService.getSpeaker(this.id)
        .then(speaker => this.speaker = speaker);
    }
  }
}
