import { Component, Input } from '@angular/core';
import { SponsorService } from '../services/sponsor.service';

@Component({
  selector: 'app-sponsor',
  styleUrls: ['./sponsor.component.scss'],
  templateUrl: './sponsor.component.html',
})
export class SponsorComponent {
  constructor(public sponsorService: SponsorService) {}

  @Input() sponsorIds!: string[];
}
