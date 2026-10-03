import { Injectable } from '@angular/core';
import { Sponsor } from '../models/sponsor';
import sponsorData from '../sponsors.data.json';

@Injectable({
  providedIn: 'root',
})
export class SponsorService {
  select(ids: string[]): Sponsor[] {
    return (sponsorData as Sponsor[]).filter(sponsor =>
      ids.includes(sponsor.id),
    );
  }
}
