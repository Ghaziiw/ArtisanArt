import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models';
import { Offer } from '../../../../core/services/offer.service';
import { ShoppingCartService } from '../../../../core/services/shopping-cart.service';

@Component({
  selector: 'app-product-info',
  imports: [CommonModule],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
})
export class ProductInfo {
  @Input() product!: Product;
  @Input() offer!: Offer;
  @Output() quantitySelected = new EventEmitter<number>();
  @Output() addProductToCart = new EventEmitter<void>();

  beforeOffer: number = 0;
  withOffer: number = 0;
  economy: number = 0;
  starsArray: number[] = [];
  quantity: number = 1;
  selectedImageIndex: number = 0; // Index of the currently selected image

  // Message properties
  showMessage: boolean = false;
  message: { type: 'success' | 'error'; text: string } = { type: 'success', text: '' };
  isHiding = false;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.computePrices();
      this.computeRating();
      this.selectedImageIndex = 0; // Reset to the first image
    }
  }

  private computePrices() {
    this.beforeOffer = this.product.price;
    if (this.offer && this.offer.percentage) {
      const discount = (this.beforeOffer * this.offer.percentage) / 100;
      this.withOffer = (this.beforeOffer - discount).toFixed(2) as unknown as number;
      this.economy = discount.toFixed(2) as unknown as number;
    } else {
      this.withOffer = this.beforeOffer;
      this.economy = 0;
    }
  }

  private computeRating() {
    this.starsArray = Math.round(this.product.avgRating) ? this.getStarsArray(this.product.avgRating) : [];
  }

  getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

  increment() {
    this.quantity++;
    this.quantitySelected.emit(this.quantity);
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantitySelected.emit(this.quantity);
    }
  }

  onClick() {
    this.shoppingCartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity,
    }).subscribe({
      next: (response) => {
        this.message = { type: 'success', text: 'Product added to cart successfully!' };
        this.showMessage = true;
        this.isHiding = false;

        setTimeout(() => {
          this.isHiding = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 500);
        }, 5000);
      },
      error: (error) => {
        this.message = { type: 'error', text: error.error?.message || 'Failed to add to cart' };
        this.showMessage = true;
        this.isHiding = false;

        setTimeout(() => {
          this.isHiding = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 500);
        }, 5000);
      },
    });
  }

  // MMethod to get the currently selected image
  get currentImage(): string {
    if (this.product?.images && this.product.images.length > 0) {
      return this.product.images[this.selectedImageIndex];
    }
    return 'assets/images/chachya.webp';
  }

  // MMethod to change the selected image
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  // MMethod to get all images except the selected one
  get otherImages(): string[] {
    if (!this.product?.images || this.product.images.length <= 1) {
      return [];
    }
    return this.product.images.filter((_, index) => index !== this.selectedImageIndex);
  }

  // MMethod to get the actual index of an image in the full array
  getImageIndex(image: string): number {
    return this.product.images?.indexOf(image) ?? 0;
  }

  // MMethod to check if a thumbnail is selected
  isImageSelected(image: string): boolean {
    return this.getImageIndex(image) === this.selectedImageIndex;
  }
}