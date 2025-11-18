import { Component, signal } from '@angular/core';
import { ItemDisplay } from './item-display/item-display';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../../core/services/product.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search-results-tab',
  imports: [ItemDisplay, CommonModule, HttpClientModule],
  templateUrl: './search-results-tab.html',
  styleUrls: ['./search-results-tab.css'],
})
export class SearchResultsTab {
  constructor(private productService: ProductService) {}

  products: Product[] = [];

  ngOnInit() {
    this.productService.getProducts(1, 20).subscribe({
      next: (res) => {
        this.products = res.items;
      },
      error: (err) => console.error(err)
    });
  }

}
