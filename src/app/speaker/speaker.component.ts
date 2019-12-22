import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Speaker } from '../speaker';

@Component({
  selector: 'app-speaker',
  styleUrls: ['./speaker.component.scss'],
  templateUrl: './speaker.component.html',
})
export class SpeakerComponent implements OnInit {
  constructor(private dataService: DataService) {}

  @Input() speakerId$!: Observable<string>;

  speaker$?: Observable<Speaker>;

  ngOnInit() {
    this.speaker$ = this.speakerId$
        .pipe(
          switchMap((id: string) => this.dataService.speaker$(id))
        );
  }
}
