import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { RouterLink } from '@angular/router';
import { CartProductCard } from './cart-product-card/cart-product-card';

@Component({
  selector: 'app-cart',
  imports: [Header,RouterLink,CartProductCard],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  
}
