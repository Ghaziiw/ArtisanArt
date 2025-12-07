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
  starsArray: number[] = [];
  quantity : number = 1;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product) {
      this.computePrices(); //to calculate discount, and the price with the discount dynamically
      this.computeRating(); //to calculate average rating and stars array
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

  // compute average rating and stars array
  private computeRating() {
    this.starsArray = Math.round(this.product.avgRating) ? this.getStarsArray(this.product.avgRating) : [];
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
