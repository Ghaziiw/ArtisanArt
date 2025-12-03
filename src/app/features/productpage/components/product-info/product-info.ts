import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models';
import { Offer } from '../../../../core/services/offer.service';

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
  rating: number = 0;
  starsArray: number[] = [];
  quantity : number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.computePrices(); //to calculate discount, and the price with the discount dynamically
      this.computeRating(); //to have an adequate format for the rating
    }
  }

  private computePrices() {
    this.beforeOffer = this.product.price;
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
    if (this.product.comments) {
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

  //for stars 
   getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

  //increment and decrement quantity
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
    console.log("clicked");
    this.addProductToCart.emit();
  }
}
