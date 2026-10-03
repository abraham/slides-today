import { Component, computed, inject, input } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatChipListbox } from '@angular/material/chips';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tags',
  styleUrls: ['./tags.component.scss'],
  templateUrl: './tags.component.html',
  imports: [MatChipListbox, TagComponent],
})
export class TagsComponent {
  private dataService = inject(DataService);

  readonly currentTags = input<string[]>([]);

  readonly tags = computed(() =>
    this.dataService.filterTags(this.currentTags()),
  );
}
