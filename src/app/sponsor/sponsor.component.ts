import { Component, Input, inject } from '@angular/core';
import { SponsorService } from '../services/sponsor.service';

@Component({
  selector: 'app-sponsor',
  styleUrls: ['./sponsor.component.scss'],
  templateUrl: './sponsor.component.html',
  standalone: false,
})
export class SponsorComponent {
  sponsorService = inject(SponsorService);

  @Input() sponsorIds!: string[];
}
