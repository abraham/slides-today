import { Component, computed, inject, input } from '@angular/core';
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
  styleUrl: './sponsor.component.scss',
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
  readonly sponsors = computed(() =>
    this.sponsorService.select(this.sponsorIds()),
  );
}
