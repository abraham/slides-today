import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Speaker } from '../speaker';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss'],
})
export class SpeakerComponent implements OnInit {
  constructor(private dataService: DataService) {}

  @Input() speakerId$!: Observable<string>;

  public speaker$?: Observable<Speaker>;

  public ngOnInit() {
    this.speaker$ = this.speakerId$
        .pipe(
          switchMap((id: string) => this.dataService.speaker$(id))
        );
  }
}
