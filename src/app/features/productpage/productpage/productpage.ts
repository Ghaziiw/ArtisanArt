import { Component } from '@angular/core';
import { ProductInfo } from '../components/product-info/product-info';
import { ReviewsContainer } from '../components/reviews-container/reviews-container';
import { CraftsmanInfo } from '../components/craftsman-info/craftsman-info';
import { Product } from '../../../core/models';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Offer, OfferService } from '../../../core/services/offer.service';
import { CraftsmanService } from '../../../core/services/craftsman.service';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShoppingCartService } from '../../../core/services/shopping-cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Craftsman } from '../../../core/models';
import { Header } from '../../../shared/components/header/header';
import { Footer } from '../../../shared/components/footer/footer';
@Component({
  selector: 'app-productpage',
  imports: [ProductInfo, ReviewsContainer, CraftsmanInfo, CommonModule, Header, Footer],
  templateUrl: './productpage.html',
  styleUrl: './productpage.css',
})
export class Productpage {
  product : Product | null = null;
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
    private specificProductService: ProductService,
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
      if (!this.product) return;
      this.craftsmanService
      .getCraftsmanById(this.product.craftsman.userId) 
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
            if (!this.product) return;
            this.showStyledAlert('Commentaire publié avec succès !', 'success');
            this.specificProductService
            .getProductById(this.product.id)
            .subscribe((updatedProduct) => {
            if (!this.product) return;
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