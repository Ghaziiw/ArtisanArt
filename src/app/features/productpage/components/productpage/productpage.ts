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
import { ShoppingCartService } from '../../../../core/services/shopping-cart.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  quantity: number = 1;
  alertMessage: string='';
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;
  productId: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specificProductService: SpecificProductService,
    private offerService : OfferService,
    private craftsmanService: CraftsmanService,
    private commentService: CommentService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService
  ){}


  ngOnInit() : void {
    // Get product ID from route parameters
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') || '';
      if (this.productId) {
        this.loadProductData();
      }
    });}


    loadProductData(){
      this.specificProductService
      .getProductById(this.productId) 
      .subscribe((data) => {
        this.product = data;
      });

      this.offerService
      .getOffer(this.productId) 
      .subscribe((data) => {
        this.offer = data;
      });

      this.craftsmanService
      .getCraftsmanById(this.product.craftsmanId) 
      .subscribe((data) => {
        this.craftsman = data;
      });

    }

  saveReview(event: {mark: number, content: string}) {
        console.log("Données reçues du child :", event);
        this.commentService.addComment({
        productId: this.productId,
        content: event.content,
        mark: event.mark
        }).subscribe({
          next: () => {
            this.showStyledAlert('Commentaire publié avec succès !', 'success');
            this.specificProductService
            .getProductById(this.product.id)
            .subscribe((updatedProduct) => {
            this.product.comments = updatedProduct.comments;
            });
          },
          error: () => {
            this.showStyledAlert('Erreur lors de l’envoi du commentaire.', 'error');
          }
        }
      )
    }

    showStyledAlert(message: string, type: 'success' | 'error') {
      this.alertMessage = message;
      this.alertType = type;
      this.showAlert = true;

      // Masquer l’alert après 3 secondes
      setTimeout(() => {
        this.showAlert = false;
       }, 3000);
      }

      onQuantitySelected(qty: number) {
        this.quantity = qty;
      }

addToCart() {
  console.log("clicked!");

  this.shoppingCartService.addToCart({
    productId: this.productId,
    quantity: this.quantity
  }).subscribe({
    next: (response) => { 
      this.showStyledAlert('Produit ajouté au panier avec succès !', 'success');
    },
    error: (err) => {
      this.showStyledAlert('Erreur lors de l’ajout au panier.', 'error');
    }
  });

}

  goBack() {
    this.router.navigate(['/']);
  }


}
