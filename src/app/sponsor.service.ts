import { Injectable } from '@angular/core';
import { Sponsor } from './sponsor';
import { SPONSORS } from './sponsors.data';

@Injectable()
export class SponsorsService {
  getSponsors(): Promise<Sponsor[]> {
    return Promise.resolve(SPONSORS);
  }

  filter(ids: string[]): Promise<Sponsor[]> {
    return Promise.resolve(SPONSORS.filter(sponsor => ids.includes(sponsor.id)));
  }
}
