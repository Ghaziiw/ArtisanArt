import { Component, signal } from '@angular/core';
import { Header } from './shared/components/header/header';
import { SearchFiltersBar } from './features/homepage/components/search-filters-bar/search-filters-bar';
import { SearchResultsTab } from './features/homepage/components/search-results-tab/search-results-tab';
import { HttpClientModule } from '@angular/common/http';
import { ProductFilters } from './features/homepage/components/search-filters-bar/product-filters.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [Header,SearchFiltersBar, SearchResultsTab, HttpClientModule, FormsModule],
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
