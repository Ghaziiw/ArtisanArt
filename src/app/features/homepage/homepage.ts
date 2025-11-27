import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { SearchFiltersBar } from './components/search-filters-bar/search-filters-bar';
import { SearchResultsTab } from './components/search-results-tab/search-results-tab';
import { ProductFilters } from './components/search-filters-bar/product-filters.interface';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Header, SearchFiltersBar, SearchResultsTab],
  template: `
    <app-header></app-header>
    <div class="horizontal-div">
      <app-search-filters-bar (filtersChange)="onFiltersChange($event)"></app-search-filters-bar>
      <app-search-results-tab [filters]="currentFilters"></app-search-results-tab>
    </div>
  `,
})
export class Homepage {
  currentFilters: ProductFilters = {};

  onFiltersChange(filters: ProductFilters) {
    this.currentFilters = filters;
  }
}