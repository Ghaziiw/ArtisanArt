import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment as productComment } from '../../../../core/services/specific-product.service';
@Component({
  selector: 'app-review',
  templateUrl: './review.html',
  styleUrls: ['./review.css'],
  imports:[CommonModule],
})
export class ReviewComponent {

  /*comments = [
    {
      rating: 5,
      clientName: "Mayssa Ben Mrad",
      content: "Amazing Product",
      createdAt: "2025-11-21",
      clientImg: "assets/images/seller1.jpg" 
    }
  ];*/

  @Input() comments : productComment[] = [];

  getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

}

