import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


export interface Product {
  image: string;
  category: string;
  name: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  //@Input() product!: Product;
  product={image:'',category:'Electronics',name:'Premium Wired Headset',description:'High-quality sound with noise cancellation and comfortable fit for all-day wear.',originalPrice:300,currentPrice:350,rating:4.5,reviews:123};

  // Compute full stars and whether there's a half star
  get fullStars(): number {
    return Math.floor(this.product.rating);
  }

  get halfStar(): number | null {
    return this.product.rating % 1 >= 0.5 ? this.fullStars + 1 : null;
  }
}
