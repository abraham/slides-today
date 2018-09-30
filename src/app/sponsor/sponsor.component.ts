import { Component, Input, OnInit } from '@angular/core';
import { Sponsor } from '../sponsor';
import { SponsorsService } from '../sponsor.service';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
  providers: [SponsorsService]
})
export class SponsorComponent implements OnInit {

  constructor(private sponsorService: SponsorsService) { }

  @Input() sponsorIds: string[] = [];

  sponsors: Sponsor[] = [];

  ngOnInit() {
    this.getSponsors();
  }

  getSponsors(): void {
    this.sponsorService
      .filter(this.sponsorIds)
      .then(sponsors => this.sponsors = sponsors);
  }
}
