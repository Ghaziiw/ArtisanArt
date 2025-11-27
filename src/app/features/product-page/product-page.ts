import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { ProductInfos } from "./product-infos/product-infos";
import { Footer } from "../../shared/components/footer/footer";
import { ArtisanCard } from '../homepage/components/artisan-card/artisan-card';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [Header, ProductInfos, Footer,ArtisanCard],
  templateUrl: './product-page.html',
  styleUrls: ['./product-page.css'],
})
export class ProductPage {

}