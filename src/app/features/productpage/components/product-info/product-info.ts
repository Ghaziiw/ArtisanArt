import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quantity } from '../quantity/quantity';
import { ShoppingCartBtn } from '../shopping-cart-btn/shopping-cart-btn';

@Component({
  selector: 'app-product-info',
  imports: [CommonModule, Quantity, ShoppingCartBtn],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
})
export class ProductInfo {
  categorie : string = "electronics" ;
  rating : number = 4.8;         
  reviewsCount : number = 342;
  beforeOffer : number = 399.99 ;
  withOffer : number = 299.99 ;
  economy : number = 100 ;
  description : string = "High-quality sound with noise cancellation and comfortable fit for all-day wear."
  stock : number = 15 ;
  productName : string = "wireless headphones" ;

  get starsArray() {
    const rounded = Math.round(this.rating); 
    return Array(rounded).fill(0);
  }

  quantity = 1;

  onQuantityChanged(newquantity: number) {
    this.quantity = newquantity;
  }
}
