import { NgModule } from '@angular/core';
import {
  ExtraOptions,
  RouterModule,
  Routes,
  UrlMatchResult,
  UrlSegment,
} from '@angular/router';
import { environment } from '../../environments/environment';
import { DeckDetailsComponent } from '../deck-details/deck-details.component';
import { DeckListComponent } from '../deck-list/deck-list.component';
import { DeckResolverService } from '../services/deck-resolver.service';

function isHome(url: UrlSegment[]): UrlMatchResult {
  const noPaths = url.length === 0;
  const tagsPath = url[0]?.path === 'tags';
  const consumed = noPaths || tagsPath ? url : [];
  return { consumed };
}

const routes: Routes = [
  {
    loadChildren: () => {
      return import(/* webpackChunkName: 'home' */ './home.module').then(m => {
        return m.HomeModule;
      });
    },
    matcher: isHome,
  },
  {
    loadChildren: () => {
      return import(/* webpackChunkName: 'deck' */ './deck.module').then(m => {
        return m.DeckModule;
      });
    },
    path: 'decks/:id',
    resolve: { deck: DeckResolverService },
  },
  {
    path: 'decks',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    loadChildren: () => {
      return import(
        /* webpackChunkName: 'not-found' */ './not-found.module'
      ).then(m => {
        return m.NotFoundModule;
      });
    },
    path: '**',
  },
];

const config: ExtraOptions = {
  enableTracing: !environment.production,
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, config)],
})
export class AppRoutingModule {}

export type RoutedComponents = DeckDetailsComponent | DeckListComponent;
