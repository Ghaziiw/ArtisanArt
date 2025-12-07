import { Component } from '@angular/core';
import { ProductInfo } from '../components/product-info/product-info';
import { ReviewsContainer } from '../components/reviews-container/reviews-container';
import { CraftsmanInfo } from '../components/craftsman-info/craftsman-info';
import { Product } from '../../../core/models';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { Offer, OfferService } from '../../../core/services/offer.service';
import { CraftsmanService } from '../../../core/services/craftsman.service';
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
  product: Product | null = null;
  offer!: Offer;
  craftsman!: Craftsman;
  quantity: number = 1;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;
  productId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specificProductService: ProductService,
    private offerService: OfferService,
    private craftsmanService: CraftsmanService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') || '';
      if (this.productId) {
        this.loadProductData();
      }
    });
  }

  loadProductData() {
    this.specificProductService
      .getProductById(this.productId) 
      .subscribe((data) => {
        this.product = data;
        
        // Load craftsman information
        if (this.product) {
          this.craftsmanService
            .getCraftsmanById(this.product.craftsman.userId) 
            .subscribe((data) => {
              this.craftsman = data;
            });
        }
      });

    this.offerService
      .getOffer(this.productId) 
      .subscribe((data) => {
        this.offer = data;
      });
  }

  // After a comment is added
  onCommentAdded() {
    // Reload only the product to get updated comments
    this.specificProductService
      .getProductById(this.productId)
      .subscribe((updatedProduct) => {
        if (this.product) {
          this.product.comments = updatedProduct.comments;
          this.product.avgRating = updatedProduct.avgRating;
          this.product.totalComments = updatedProduct.totalComments;
        }
      });
  }

  showStyledAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  onQuantitySelected(qty: number) {
    this.quantity = qty;
  }

  addToCart() {
    this.shoppingCartService.addToCart({
      productId: this.productId,
      quantity: this.quantity
    }).subscribe({
      next: (response) => { 
        this.showStyledAlert('Product added to cart successfully!', 'success');
      },
      error: (err) => {
        this.showStyledAlert('Error adding product to cart.', 'error');
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}