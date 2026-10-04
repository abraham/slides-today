import { Injectable, inject, signal } from '@angular/core';
import { Sponsor } from '../models/sponsor';
import { SPONSORS } from '../repositories';

@Injectable({
  providedIn: 'root',
})
export class SponsorService {
  private readonly sponsorsState = signal<Sponsor[]>([]);

  readonly loaded = inject(SPONSORS)
    .list()
    .then(sponsors => {
      this.sponsorsState.set(sponsors);
    });

  select(ids: string[]): Sponsor[] {
    return this.sponsorsState().filter(sponsor => ids.includes(sponsor.id));
  }
}
