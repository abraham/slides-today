import { Component, Input } from '@angular/core';
import { Resource } from '../resource';

@Component({
  selector: 'app-deck-resources',
  templateUrl: './deck-resources.component.html',
  styleUrls: ['./deck-resources.component.scss']
})
export class DeckResourcesComponent {
  @Input() resources: Resource[] = [];
}
