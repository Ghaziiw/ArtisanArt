import { Component } from '@angular/core';
import { ProductInfo } from '../product-info/product-info';
import { ProductPhotos } from '../product-photos/product-photos';
import { ReviewsContainer } from '../reviews-container/reviews-container';
import { CraftsmanInfo } from '../craftsman-info/craftsman-info';
import { SpecificProductService, SpecificProduct } from '../../../../core/services/specific-product.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-productpage',
  imports: [ProductInfo, ProductPhotos, ReviewsContainer, CraftsmanInfo, CommonModule],
  templateUrl: './productpage.html',
  styleUrl: './productpage.css',
})
export class Productpage {
  product !: SpecificProduct;
  constructor(private specificProductService: SpecificProductService){}
  ngOnInit() : void {
      this.specificProductService
      .getProductById("469f25da-d42c-4dde-987d-d021182445f4") //pour tester
      .subscribe((data) => {
        //console.log('Productpage received product:', data);
        this.product = data;
      });
  }

}
