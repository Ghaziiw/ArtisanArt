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
  selectedImageIndex: number = 0; // Index de l'image sélectionnée

  // Message properties
  showMessage: boolean = false;
  message: { type: 'success' | 'error'; text: string } = { type: 'success', text: '' };
  isHiding = false;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.computePrices();
      this.computeRating();
      this.selectedImageIndex = 0; // Réinitialiser à la première image
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
          }, 500); // Durée de l'animation de disparition
        }, 5000); // Durée d'affichage du message
      },
      error: (error) => {
        this.message = { type: 'error', text: error.error?.message || 'Failed to add to cart' };
        this.showMessage = true;
        this.isHiding = false;

        setTimeout(() => {
          this.isHiding = true;
          setTimeout(() => {
            this.showMessage = false;
          }, 500); // Durée de l'animation de disparition
        }, 5000); // Durée d'affichage du message
      },
    });
  }

  // Méthode pour obtenir l'image actuellement sélectionnée
  get currentImage(): string {
    if (this.product?.images && this.product.images.length > 0) {
      return this.product.images[this.selectedImageIndex];
    }
    return 'assets/images/chachya.webp';
  }

  // Méthode pour changer l'image sélectionnée
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  // Méthode pour obtenir toutes les images sauf celle sélectionnée
  get otherImages(): string[] {
    if (!this.product?.images || this.product.images.length <= 1) {
      return [];
    }
    return this.product.images.filter((_, index) => index !== this.selectedImageIndex);
  }

  // Méthode pour obtenir l'index réel d'une image dans le tableau complet
  getImageIndex(image: string): number {
    return this.product.images?.indexOf(image) ?? 0;
  }

  // Méthode pour vérifier si une miniature est sélectionnée
  isImageSelected(image: string): boolean {
    return this.getImageIndex(image) === this.selectedImageIndex;
  }
}