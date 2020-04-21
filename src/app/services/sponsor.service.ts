import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sponsor } from '../models/sponsor';
import sponsorData from '../sponsors.data.json';

@Injectable({
  providedIn: 'root',
})
export class SponsorService {
  select(ids: string[]): Observable<Sponsor[]> {
    return of(sponsorData).pipe(
      map((sponsors: Sponsor[]) =>
        sponsors.filter(sponsor => ids.includes(sponsor.id)),
      ),
    );
  }
}
