import { Component } from '@angular/core';
import { ProductInfo } from '../product-info/product-info';
import { ProductPhotos } from '../product-photos/product-photos';
import { ReviewsContainer } from '../reviews-container/reviews-container';
import { CraftsmanInfo } from '../craftsman-info/craftsman-info';

@Component({
  selector: 'app-productpage',
  imports: [ProductInfo, ProductPhotos, ReviewsContainer, CraftsmanInfo],
  templateUrl: './productpage.html',
  styleUrl: './productpage.css',
})
export class Productpage {

}
