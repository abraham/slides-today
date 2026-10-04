import { Component, computed, inject, input } from '@angular/core';
import { SponsorService } from '../services/sponsor.service';
import { CardComponent } from '../card/card.component';
import {
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
  MatListItemLine,
  MatNavList,
} from '@angular/material/list';

@Component({
  selector: 'app-sponsor',
  styleUrl: './sponsor.component.scss',
  templateUrl: './sponsor.component.html',
  imports: [
    CardComponent,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
    MatNavList,
  ],
})
export class SponsorComponent {
  private readonly sponsorService = inject(SponsorService);

  readonly sponsorIds = input.required<string[]>();
  readonly sponsors = computed(() =>
    this.sponsorService.select(this.sponsorIds()),
  );
}
