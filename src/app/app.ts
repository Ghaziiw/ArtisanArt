import { Component, signal } from '@angular/core';
import { Header } from './shared/components/header/header';
import { SearchFiltersBar } from './features/homepage/components/search-filters-bar/search-filters-bar';
import { SearchResultsTab } from './features/homepage/components/search-results-tab/search-results-tab';
import { HttpClientModule } from '@angular/common/http';
import { Profile } from './features/profile/profile';
import { ProductFilters } from './features/homepage/components/search-filters-bar/product-filters.interface';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './features/login-sign-up/components/login-page/login-page';

@Component({
  selector: 'app-root',
  imports: [Header,SearchFiltersBar, SearchResultsTab, HttpClientModule, FormsModule,Profile,LoginPage],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('ArtisanArt');

  currentFilters: ProductFilters = {};

  onFiltersChange(filters: ProductFilters) {
    this.currentFilters = filters;
  }
}
