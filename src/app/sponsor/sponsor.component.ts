import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { Sponsor } from '../sponsor';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
  providers: [DataService]
})
export class SponsorComponent implements OnInit {

  constructor(private dataService: DataService) { }

  @Input() sponsorIds: string[] = [];

  public sponsors$: Observable<Sponsor[]>;

  ngOnInit() {
    this.sponsors$ = this.dataService.filterSponsors$(this.sponsorIds);
  }
}
