import { Component, Input } from '@angular/core';
import { Resource } from '../models/resource';
import { CardComponent } from '../card/card.component';
import {
  MatList,
  MatListItem,
  MatListItemTitle,
  MatListItemMeta,
  MatListItemIcon,
} from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-deck-resources',
  styleUrls: ['./deck-resources.component.scss'],
  templateUrl: './deck-resources.component.html',
  imports: [
    CardComponent,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemMeta,
    MatIcon,
    MatListItemIcon,
  ],
})
export class DeckResourcesComponent {
  @Input() resources: Resource[] = [];
}
