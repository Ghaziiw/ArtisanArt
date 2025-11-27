import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-photos',
  imports: [CommonModule],
  templateUrl: './product-photos.html',
  styleUrl: './product-photos.css',
})
export class ProductPhotos implements OnChanges {

  @Input() offer : number =0 ;
  @Input() images : string[] = [];

  selectedImage: string = ""; 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'] && this.images && this.images.length > 0) {
      this.selectedImage = this.images[0]; 
    }
  }

  changeSelected(img: string) {
    this.selectedImage = img;
  }
}
