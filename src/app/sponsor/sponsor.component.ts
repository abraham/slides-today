import { Component, Input } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sponsor',
  styleUrls: ['./sponsor.component.scss'],
  templateUrl: './sponsor.component.html',
})
export class SponsorComponent {
  constructor(public dataService: DataService) { }

  @Input() sponsorIds?: string[];
}
