import { Component, Input, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Craftsman } from '../../../../core/services/craftsman.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-craftsman-info',
  imports: [CommonModule],
  templateUrl: './craftsman-info.html',
  styleUrl: './craftsman-info.css',
})
export class CraftsmanInfo {
    @Input() craftsman !: Craftsman;
    rating : number = 0;
    starsArray: number[] = [] ;

    constructor(private router: Router){}

    ngOnChanges(changes: SimpleChange): void {
      if(this.craftsman){
        this.computeRating();
      }
    }

    private computeRating(){
      this.rating=Number(this.craftsman.avgRating.toFixed(2));
      const rounded = Math.round(this.rating); 
      this.starsArray = Array(rounded).fill(0);
    }

    goToShop(){
      console.log("clicked")
      this.router.navigate(['/artisan-profile', this.craftsman.userId]);
    }


}
