import { Location } from '@angular/common';
import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { rgb } from '../color';
import { DataService } from '../data.service';
import { Deck } from '../deck';
import { Link } from '../link';
import { Tag } from '../tag';

@Component({
  selector: 'app-deck-details',
  templateUrl: './deck-details.component.html',
  styleUrls: ['./deck-details.component.scss'],
})
export class DeckDetailsComponent implements OnInit, AfterContentChecked {

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router) { }

  @Input() deck: Deck;
  @Output() onColorsChange = new EventEmitter<{ color: string, backgroundColor: string }>();
  @ViewChild('detailsEl') detailsEl;

  of = of;
  currentTags: string[] = [];
  primaryTag: Tag;
  title = '';
  defaultImage = '/assets/img/default.png';
  mapUrl: string;
  embeds: Link[];
  embedWidth: number;
  colors: { color: string, backgroundColor: string };

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.paramMap
      .pipe(switchMap((params: ParamMap) => {
          return Promise.all([
            this.dataService.deck$(params.get('id')).toPromise(),
            this.dataService.tags$.toPromise(),
          ]);
        }))
      .subscribe(([deck, tags]) => {
        this.deck = deck;
        this.primaryTag = tags.find(tag => tag.id === this.deck.tags[0]);
        this.setColors();
        this.setEmbeds();
      });
  }

  ngAfterContentChecked() {
    this.setEmbedWidth();
  }

  columnWidth(): number {
    const width = this.detailsEl.nativeElement.getBoundingClientRect().width;
    if (width >= 640) {
      return width / 2;
    } else {
      return width;
    }
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  open(url: string): void {
    window.open(url);
  }

  setColors(): void {
    this.colors = {
      backgroundColor: rgb(this.primaryTag.primaryColor),
      color: rgb(this.primaryTag.complementaryColor),
    };
    this.onColorsChange.emit(this.colors);
  }

  setEmbedWidth(): void {
    if (this.embedWidth !== this.columnWidth()) {
      this.embedWidth = this.columnWidth();
    }
  }

  setEmbeds(): void {
    const embedServices = ['youtube', 'google-slides', 'vimeo'];
    this.embeds = this.deck.links.filter(link => embedServices.includes(link.service));
  }
}
