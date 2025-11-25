import { Component } from '@angular/core';
import { ProductInfo } from '../product-info/product-info';
import { ProductPhotos } from '../product-photos/product-photos';
import { ReviewsContainer } from '../reviews-container/reviews-container';
import { CraftsmanInfo } from '../craftsman-info/craftsman-info';
import { SpecificProductService, SpecificProduct } from '../../../../core/services/specific-product.service';
import { CommonModule } from '@angular/common';
import { Offer, OfferService } from '../../../../core/services/offer.service';
import { CraftsmanService, Craftsman  } from '../../../../core/services/craftsman.service';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-productpage',
  imports: [ProductInfo, ProductPhotos, ReviewsContainer, CraftsmanInfo, CommonModule],
  templateUrl: './productpage.html',
  styleUrl: './productpage.css',
})
export class Productpage {
  product !: SpecificProduct;
  offer !: Offer;
  craftsman !: Craftsman;

  constructor(
    private specificProductService: SpecificProductService,
    private offerService : OfferService,
    private craftsmanService: CraftsmanService,
    private commentService: CommentService,
    private authService: AuthService,
  ){}


  ngOnInit() : void {
      this.specificProductService
      .getProductById("469f25da-d42c-4dde-987d-d021182445f4") //pour tester
      .subscribe((data) => {
        //console.log('Productpage received product:', data);
        this.product = data;
      });

      this.offerService
      .getOffer("469f25da-d42c-4dde-987d-d021182445f4") //pour tester
      .subscribe((data) => {
        //console.log('Productpage received offer:', data);
        this.offer = data;
      });

      this.craftsmanService
      .getCraftsmanById("vsJLETIYDpMLk07qlNdn1rNVmIHZVydv") //pour tester
      .subscribe((data) => {
        //console.log('Productpage received craftsman:', data);
        this.craftsman = data;
      });

  }

  saveReview(event: {mark: number, content: string}) {
        console.log("Données reçues du child :", event);
        this.commentService.addComment({
        productId: "469f25da-d42c-4dde-987d-d021182445f4"/*this.product.id*/,
        content: event.content,
        mark: event.mark
        }).subscribe(
          () => {
            console.log("commented successfully");
          }
        )

      }

}
