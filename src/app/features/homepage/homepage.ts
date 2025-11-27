import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { SearchFiltersBar } from './components/search-filters-bar/search-filters-bar';
import { SearchResultsTab } from './components/search-results-tab/search-results-tab';
import { ProductFilters } from './components/search-filters-bar/product-filters.interface';
import { Footer } from "../../shared/components/footer/footer";
import { ArtisanProfile } from "../artisan-profile/artisan-profile";
import { ArtisanCard } from "./components/artisan-card/artisan-card";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Header, SearchFiltersBar, SearchResultsTab, Footer, ArtisanProfile, ArtisanCard],
  template: `
    <app-header></app-header>
    <div class="horizontal-div">
      <app-search-filters-bar (filtersChange)="onFiltersChange($event)"></app-search-filters-bar>
      <app-search-results-tab [filters]="currentFilters"></app-search-results-tab>
    </div>
    <div class="artisan-search" style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 20px; align-self: center; justify-self: center; max-width: 1250px;">
        <app-artisan-card></app-artisan-card>
        <app-artisan-card></app-artisan-card>
        <app-artisan-card></app-artisan-card>
        <app-artisan-card></app-artisan-card>
        <app-artisan-card></app-artisan-card>
        <app-artisan-card></app-artisan-card>
        <app-artisan-card></app-artisan-card>
        <app-artisan-card></app-artisan-card>
    </div>
    <app-footer></app-footer>
  `,
})
export class Homepage {
  currentFilters: ProductFilters = {};

  onFiltersChange(filters: ProductFilters) {
    this.currentFilters = filters;
  }
}