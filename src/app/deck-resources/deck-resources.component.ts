import { Component, Input } from '@angular/core';
import { Resource } from '../models/resource';

@Component({
  selector: 'app-deck-resources',
  styleUrls: ['./deck-resources.component.scss'],
  templateUrl: './deck-resources.component.html',
  standalone: false,
})
export class DeckResourcesComponent {
  @Input() resources: Resource[] = [];
}
