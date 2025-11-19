import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { ItemDisplay } from './item-display/item-display';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../../core/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductFilters } from '../search-filters-bar/product-filters.interface';

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

  ngOnInit() {
    this.loadProducts();
  }

  // Cette méthode est appelée chaque fois que @Input() change
  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.isLoading = true;

    this.productService.getProducts(1, 20, this.filters).subscribe({
      next: (res) => {
        this.products = res.items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
