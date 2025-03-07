import { Component, Input } from '@angular/core';
import { SponsorService } from '../services/sponsor.service';

@Component({
  selector: 'app-sponsor',
  styleUrls: ['./sponsor.component.scss'],
  templateUrl: './sponsor.component.html',
})
export class SponsorComponent {
  @Input() sponsorIds!: string[];

  constructor(public sponsorService: SponsorService) {}
}
