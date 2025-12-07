import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tags',
  styleUrls: ['./tags.component.scss'],
  templateUrl: './tags.component.html',
  standalone: false,
})
export class TagsComponent implements OnInit {
  private dataService = inject(DataService);

  @Input() currentTags: string[] = [];
  @ViewChild('tagsEl', { static: true }) tagsEl!: ElementRef;

  tags$: Observable<Tag[]>;

  constructor() {
    this.tags$ = this.dataService.tags$;
  }

  ngOnInit(): void {
    this.tags$ = this.dataService.filterTags$(this.currentTags);
  }
}
