import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { ProductCard } from "./product-card/product-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artisan-profile',
  imports: [Header, ProductCard, CommonModule],
  templateUrl: './artisan-profile.html',
  styleUrl: './artisan-profile.css',
})
export class ArtisanProfile {
  showProduct=false;
  showProducts(){
    this.showProduct=true;
  }
  showAbout(){
    this.showProduct=false;
  }
}
