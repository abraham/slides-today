import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  @Input() sponsorIds$!: Observable<string[]>;

  public sponsors$?: Observable<Sponsor[]>;

  ngOnInit() {
    this.sponsors$ = this.sponsorIds$
        .pipe(
          switchMap((ids: string[]) => this.dataService.filterSponsors$(ids))
        );
  }
}
