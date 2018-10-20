import { Injectable } from '@angular/core';
import { Sponsor } from './sponsor';
import sponsors from './sponsors.data.json';

const SPONSORS = sponsors as Sponsor[];

@Injectable()
export class SponsorsService {
  getSponsors(): Promise<Sponsor[]> {
    return Promise.resolve(SPONSORS);
  }

  filter(ids: string[]): Promise<Sponsor[]> {
    return Promise.resolve(SPONSORS.filter(sponsor => ids.includes(sponsor.id)));
  }
}
