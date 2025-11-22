import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-review',
  templateUrl: './review.html',
  styleUrls: ['./review.css'],
  imports:[CommonModule],
})
export class ReviewComponent {

  comments = [
    {
      rating: 5,
      clientName: "Mayssa Ben Mrad",
      content: "Amazing Product",
      createdAt: "2025-11-21",
      clientImg: "assets/images/seller1.jpg" 
    }
  ];

  getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

}

