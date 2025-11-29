import { Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { SearchFiltersBar } from './components/search-filters-bar/search-filters-bar';
import { SearchResultsTab } from './components/search-results-tab/search-results-tab';
import { Footer } from "../../shared/components/footer/footer";
import { ArtisanCard } from "./components/artisan-card/artisan-card";
import { CraftsmanService } from '../../core/services/craftsman.service';
import { Craftsman, ProductFilters } from '../../core/models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../core/services/filter.service';
import { ProductService } from '../../core/services/product.service';

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
export class Homepage implements OnInit {
  viewType: 'products' | 'artisans' = 'products';
  currentFilters: ProductFilters = {};
  craftsmen: Craftsman[] = [];
  filteredCraftsmen: Craftsman[] = [];
  searchQuery: string = '';

  constructor(
    private craftsmanService: CraftsmanService,
    private filterService: FilterService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Subscribe to view type changes
    this.filterService.viewType$.subscribe(type => {
      this.viewType = type;
      this.loadCraftsmen();
    });

    // Subscribe to search query changes
    this.filterService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.applySearch();
    });

    // Initial load
    this.loadCraftsmen();
  }

  loadCraftsmen() {
    if (this.viewType === 'artisans') {
      this.craftsmanService.getAllCraftsmen().subscribe((response) => {
        this.craftsmen = response.items;
        this.applySearch();
      });
    }
  }

  onFiltersChange(filters: ProductFilters) {
    // Combine filters from sidebar with searchQuery from header
    const productNameFilter = filters.productName || this.searchQuery.trim() || undefined;
    
    this.currentFilters = {
      ...filters,
      productName: productNameFilter
    };
  }

  applySearch() {
    if (this.viewType === 'artisans') {
      this.filteredCraftsmen = this.searchQuery.trim()
        ? this.craftsmen.filter(craftsman =>
            craftsman.businessName.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        : [...this.craftsmen];
    } 

    if (this.viewType === 'products') {
      // Update only the productName if searching from the header
      this.currentFilters = { 
        ...this.currentFilters, 
        productName: this.searchQuery.trim() || undefined 
      };
    }
  }
}