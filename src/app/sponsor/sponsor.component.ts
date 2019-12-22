import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Sponsor } from '../sponsor';

@Component({
  selector: 'app-sponsor',
  styleUrls: ['./sponsor.component.scss'],
  templateUrl: './sponsor.component.html',
})
export class SponsorComponent implements OnInit {
  constructor(private dataService: DataService) { }

  @Input() sponsorIds$!: Observable<string[]>;

  sponsors$?: Observable<Sponsor[]>;

  ngOnInit() {
    this.sponsors$ = this.sponsorIds$
        .pipe(
          switchMap((ids: string[]) => this.dataService.filterSponsors$(ids))
        );
  }
}
