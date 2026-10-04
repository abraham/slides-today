import { Component, computed, inject, input } from '@angular/core';
import { DataService } from '../services/data.service';
import { MatChipListbox } from '@angular/material/chips';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tag-chips',
  styleUrl: './tag-chips.component.scss',
  templateUrl: './tag-chips.component.html',
  imports: [MatChipListbox, TagComponent],
})
export class TagChipsComponent {
  private readonly dataService = inject(DataService);

  readonly currentTags = input<string[]>([]);

  readonly tags = computed(() =>
    this.dataService.filterTags(this.currentTags()),
  );
}
