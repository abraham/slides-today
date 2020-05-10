import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { NEVER, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Deck } from '../models/deck';
import { DeckService } from '../services/deck.service';
import { ThemeService } from '../services/theme.service';

@Injectable({
  providedIn: 'root',
})
export class DeckResolverService implements Resolve<Deck> {
  constructor(
    private deckService: DeckService,
    private router: Router,
    private themeService: ThemeService,
    private location: Location,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Deck> | Observable<never> {
    return this.deckService.get(route.paramMap.get('id')).pipe(
      take(1),
      mergeMap((deck: Deck | undefined) => {
        if (deck) {
          this.themeService.update(deck.theme);
          return of(deck);
        } else {
          this.router
            .navigate(['/404'], { skipLocationChange: true })
            .then(() => {
              // Workaround for URL changing https://github.com/angular/angular/issues/16981#issuecomment-549330207
              this.location.replaceState(state.url);
            });
          return NEVER;
        }
      }),
    );
  }
}
