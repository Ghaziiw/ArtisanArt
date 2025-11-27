import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { SearchFiltersBar } from './components/search-filters-bar/search-filters-bar';
import { SearchResultsTab } from './components/search-results-tab/search-results-tab';
import { ProductFilters } from './components/search-filters-bar/product-filters.interface';
import { Footer } from "../../shared/components/footer/footer";
import { ArtisanCard } from "./components/artisan-card/artisan-card";
import { CraftsmanService } from '../../core/services/craftsman.service';
import { Craftsman } from '../../core/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [
    Header,
    SearchFiltersBar,
    SearchResultsTab,
    Footer,
    ArtisanCard,
    FormsModule,
    CommonModule
  ],
  templateUrl: './homepage.html',
})
export class Homepage {
  currentFilters: ProductFilters = {};
  craftsmen: Craftsman[] = [];

  constructor(private craftsmanService: CraftsmanService) {}

  ngOnInit() {
    this.craftsmanService.getAllCraftsmen().subscribe((response) => {
      this.craftsmen = response.items;
    });
  }

  onFiltersChange(filters: ProductFilters) {
    this.currentFilters = filters;
  }
}
