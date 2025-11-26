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

  @Input() comments : productComment[] = [];

  getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

  dateOnly(date: string): string{
    return date.substring(0,10);
  }

}

