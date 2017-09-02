import { Component, OnInit, Input } from '@angular/core';

import { SponsorsService } from '../sponsor.service';
import { Sponsor } from '../sponsor';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css'],
  providers: [SponsorsService]
})
export class SponsorComponent implements OnInit {

  constructor(private sponsorService: SponsorsService) { }

  @Input() sponsorIds: string[];

  sponsors: Sponsor[];

  ngOnInit() {
    setTimeout(() => {
      this.getSponsors();
    }, 0);
  }

  getSponsors(): void {
    this.sponsorService.filter(this.sponsorIds).then(sponsors => this.sponsors = sponsors);
  }
}
