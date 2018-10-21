import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { Speaker } from '../speaker';

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss'],
  providers: [DataService],
})
export class SpeakerComponent implements OnInit {
  constructor(private dataService: DataService) { }

  @Input() id: string;

  public speaker$: Observable<Speaker>;

  ngOnInit() {
    this.speaker$ = this.dataService.speaker$(this.id);
  }
}
