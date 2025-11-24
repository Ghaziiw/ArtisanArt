import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-craftsman-info',
  imports: [CommonModule],
  templateUrl: './craftsman-info.html',
  styleUrl: './craftsman-info.css',
})
export class CraftsmanInfo {
    craftsmanimg : string ="../../../../assets/images/seller1.jpg";
    storeName: string = "TechGear" ; 
    job : string ="Audio Specialist" ;
    location : string ="New York" ;
    rating : number = 4.8;
    description : string = "Passionate about bringing audio" ;
    reviewsCount : number = 1250 ;
    phone : number = 11111111 ; 


    get starsArray() {
      const rounded = Math.round(this.rating); 
      return Array(rounded).fill(0);
    }


}
