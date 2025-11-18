import { Component, signal } from '@angular/core';
import { Header } from './shared/components/header/header';
import { SearchFiltersBar } from './features/homepage/components/search-filters-bar/search-filters-bar';
import { SearchResultsTab } from './features/homepage/components/search-results-tab/search-results-tab';
import { FollowingExplore } from './features/homepage/components/following-explore/following-explore';

@Component({
  selector: 'app-root',
  imports: [Header,SearchFiltersBar,FollowingExplore,SearchResultsTab],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ArtisanArt');
}
