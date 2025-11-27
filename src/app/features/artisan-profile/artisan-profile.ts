import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { ProductCard } from "./product-card/product-card";
import { CommonModule } from '@angular/common';
import { CraftsmanService, Craftsman } from '../../core/services/craftsman.service';
import { ProductService, Product } from '../../core/services/product.service';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-artisan-profile',
  standalone: true,
  imports: [Header, ProductCard, CommonModule, RouterLink, Footer],
  templateUrl: './artisan-profile.html',
  styleUrl: './artisan-profile.css',
})
export class ArtisanProfile implements OnInit {
  showProduct = true;
  craftsman: Craftsman | null = null;
  products: Product[] = [];
  isLoading = true;
  craftsmanId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private craftsmanService: CraftsmanService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Get craftsman ID from route parameters
    this.route.paramMap.subscribe(params => {
      this.craftsmanId = params.get('id') || '';
      if (this.craftsmanId) {
        this.loadCraftsmanData();
        this.loadCraftsmanProducts();
      }
    });
  }

  loadCraftsmanData() {
    this.craftsmanService.getCraftsmanById(this.craftsmanId).subscribe({
      next: (craftsman) => {
        this.craftsman = craftsman;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load craftsman data:', err);
        this.isLoading = false;
      }
    });
  }

  loadCraftsmanProducts() {
    this.productService.getProducts(1, 100, { craftsmanId: this.craftsmanId }).subscribe({
      next: (response) => {
        console.log(response.items)
        this.products = response.items;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      }
    });
  }

  showProducts() {
    this.showProduct = true;
  }

  showAbout() {
    this.showProduct = false;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}