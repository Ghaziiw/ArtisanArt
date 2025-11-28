import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { ItemDisplay } from './item-display/item-display';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductFilters } from '../search-filters-bar/product-filters.interface';
import { Product } from '../../../../core/models';

@Component({
  selector: 'app-search-results-tab',
  imports: [ItemDisplay, CommonModule, HttpClientModule],
  templateUrl: './search-results-tab.html',
  styleUrls: ['./search-results-tab.css'],
})
export class SearchResultsTab {
  constructor(private productService: ProductService) {}
  @Input() filters: ProductFilters = {};

  products: Product[] = [];
  isLoading = true;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;

  ngOnInit() {
    this.loadProducts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.currentPage = 1;
      this.loadProducts();
    }
  }

  loadProducts() {
    this.isLoading = true;

    this.productService.getProducts(this.currentPage, this.itemsPerPage, this.filters).subscribe({
      next: (res) => {
        this.products = res.items;
        this.totalPages = res.meta.totalPages;
        this.itemsPerPage = res.meta.itemsPerPage;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }
}
