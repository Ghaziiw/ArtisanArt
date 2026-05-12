import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit {
  @Input() product!: Product;

  constructor(private router: Router) {}

  // Computed properties
  get currentPrice(): number {
    if (this.product.offer) {
      return this.product.price * (1 - this.product.offer.percentage / 100);
    }
    return this.product.price;
  }

  get hasDiscount(): boolean {
    return this.product.offer !== null;
  }

  get discountPercentage(): number {
    return this.product.offer?.percentage || 0;
  }

  get categoryName(): string {
    return this.product.category?.name || 'Uncategorized';
  }

  get productImage(): string {
    if (this.product.images && this.product.images.length > 0) {
      return this.product.images[0];
    }
    return '/assets/images/chachya.webp';
  }

  ngOnInit() {
    if (!this.product) {
      console.error('Product is required for ProductCard component');
    }
  }

  // Compute full stars and whether there's a half star
  get fullStars(): number {
    return Math.floor(this.product.avgRating || 0);
  }

  get halfStar(): number | null {
    const rating = this.product.avgRating || 0;
    return rating % 1 >= 0.5 ? this.fullStars + 1 : null;
  }

  navigateToProduct(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/product-page', this.product.id]);
  }
}