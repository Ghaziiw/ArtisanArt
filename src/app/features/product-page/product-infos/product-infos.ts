import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-infos',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-infos.html',
  styleUrl: './product-infos.css',
})
export class ProductInfos {

  selectedImage = 0;
  quantity = 1;
  thumbnailStartIndex = 0;
  maxVisibleThumbnails = 4;

  product = {
    category: 'Electronics',
    name: 'Premium Wireless Headphones',
    discount: '-25%',
    rating: 4.8,
    reviewCount: 342,
    originalPrice: 399.99,
    currentPrice: 299.99,
    savings: 100.00,
    description: 'High-quality sound with noise cancellation and comfortable fit for all-day wear.',
    stock: 15,
    images: [
      'assets/images/headphones1.jpg',
      'assets/images/headphones2.png',
      'assets/images/heaphones3.jpg',
      'assets/images/heaphones3.jpg',
      'assets/images/heaphones3.jpg',
    ]
  };

  selectImage(index: number): void {
    this.selectedImage = index;
  }

  get visibleThumbnails() {
    return this.product.images.slice(
      this.thumbnailStartIndex, 
      this.thumbnailStartIndex + this.maxVisibleThumbnails
    );
  }

  get canScrollLeft(): boolean {
    return this.thumbnailStartIndex > 0;
  }

  get canScrollRight(): boolean {
    return this.thumbnailStartIndex + this.maxVisibleThumbnails < this.product.images.length;
  }

   scrollThumbnailsLeft(): void {
    if (this.canScrollLeft) {
      this.thumbnailStartIndex--;
    }
  }

  scrollThumbnailsRight(): void {
    if (this.canScrollRight) {
      this.thumbnailStartIndex++;
    }
  }


  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  addToCart(): void {
    console.log(`Added ${this.quantity} items to cart`);
    // Implement cart logic here
  }

  addToWishlist(): void {
    console.log('Added to wishlist');
    // Implement wishlist logic here
  }

  getRatingArray(): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}