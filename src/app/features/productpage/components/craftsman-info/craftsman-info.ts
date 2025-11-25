import { Component, Input, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Craftsman } from '../../../../core/services/craftsman.service';
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

    ngOnChanges(changes: SimpleChange): void {
      if(this.craftsman){
        this.computeRating();
      }
    }

    private computeRating(){
      this.rating=this.craftsman.avgRating;
      const rounded = Math.round(this.rating); 
      this.starsArray = Array(rounded).fill(0);
    }


}
