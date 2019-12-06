import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MDCTopAppBar } from '@material/top-app-bar';
import { Observable } from 'rxjs';
import { Theme } from '../color';
import { DataService } from '../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  constructor(private dataService: DataService,
              private location: Location,
              private router: Router) {
    this.theme$ = this.dataService.theme$;
  }

  theme$: Observable<Theme>;

  @Input() title!: string;
  @Input() showBack = false;
  @ViewChild('appBar', { static: true }) appBar!: ElementRef;

  private toolbar?: MDCTopAppBar;

  ngAfterViewInit(): void {
    this.initToolbar();
  }

  goHome (): void {
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }

  initToolbar(): void {
    this.toolbar = new MDCTopAppBar(this.appBar.nativeElement);
  }

  goBack(e: MouseEvent): void {
    e.preventDefault();
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
