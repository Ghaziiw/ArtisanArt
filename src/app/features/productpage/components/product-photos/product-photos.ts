import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-photos',
  imports: [CommonModule],
  templateUrl: './product-photos.html',
  styleUrl: './product-photos.css',
})
export class ProductPhotos {
  offer = 25 ;
  selectedImage : string ="assets/images/seller1.jpg";
  images : string[] = [ "assets/images/seller1.jpg" , "assets/images/seller1.jpg" ]
}
