import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { ProductCard } from "./product-card/product-card";
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-artisan-profile',
  standalone: true,
  imports: [Header, ProductCard, CommonModule, RouterLink],
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
