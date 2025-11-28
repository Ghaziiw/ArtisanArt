import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quantity } from '../quantity/quantity';
import { ShoppingCartBtn } from '../shopping-cart-btn/shopping-cart-btn';
import { SpecificProduct } from '../../../../core/services/specific-product.service';
import { Offer } from '../../../../core/services/offer.service';

@Component({
  selector: 'app-product-info',
  imports: [CommonModule, Quantity, ShoppingCartBtn],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
})
export class ProductInfo {
 @Input() product!: SpecificProduct;
 @Input() offer!: Offer;
 @Output() quantitySelected = new EventEmitter<number>();
 @Output() addProductToCart = new EventEmitter<void>();

  beforeOffer: number = 0;
  withOffer: number = 0;
  economy: number = 0;
  rating: number = 0;
  starsArray: number[] = [];
  quantity : number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("received product:", this.product);
    //console.log("received offer:", this.offer);
    if (this.product) {
      this.computePrices();
      this.computeRating();
    }
  }

  private computePrices() {
    this.beforeOffer = parseFloat(this.product.price);
    if (this.offer && this.offer.percentage) {
      const discount = (this.beforeOffer * this.offer.percentage) / 100;
      this.withOffer = this.beforeOffer - discount;
      this.economy = discount;
    } else {
      this.withOffer = this.beforeOffer;
      this.economy = 0;
    }
  }

  private computeRating() {
    if (this.product.comments.length > 0) {
      const total = this.product.comments.reduce((sum, c) => sum + c.mark, 0);
      this.rating = total / this.product.comments.length;
      this.rating = Number(this.rating.toFixed(2));
      const rounded = Math.round(this.rating);
      this.starsArray = Array(rounded).fill(0);
    } else {
      this.rating = 0;
      this.starsArray = [];
      return;
    }
  }

   getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

  onQuantityChanged(newquantity: number) {
    this.quantity = newquantity;
    this.quantitySelected.emit(this.quantity);
  }

  notifyAddToCart() {
    this.addProductToCart.emit();
  }
}
