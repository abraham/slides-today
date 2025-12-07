import { Component, Input, inject } from '@angular/core';
import { SponsorService } from '../services/sponsor.service';
import { CardComponent } from '../card/card.component';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
  MatListItemLine,
} from '@angular/material/list';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe,
  ],
})
export class SponsorComponent {
  sponsorService = inject(SponsorService);

  @Input() sponsorIds!: string[];
}
