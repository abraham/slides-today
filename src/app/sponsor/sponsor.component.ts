import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { SponsorService } from '../services/sponsor.service';
import { CardComponent } from '../card/card.component';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';

@Component({
  selector: 'app-sponsor',
  styleUrls: ['./sponsor.component.scss'],
  templateUrl: './sponsor.component.html',
  imports: [
    CardComponent,
    MatList,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
  ],
})
export class SponsorComponent {
  private sponsorService = inject(SponsorService);

  readonly sponsorIds = input.required<string[]>();
  readonly sponsors = toSignal(
    toObservable(this.sponsorIds).pipe(
      switchMap(ids => this.sponsorService.select(ids)),
    ),
  );
}
