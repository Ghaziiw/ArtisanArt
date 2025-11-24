import { Component, Input } from '@angular/core';
import { ReviewForm } from '../review-form/review-form';
import { ReviewComponent } from '../review/review';
import { Comment as productComment } from '../../../../core/services/specific-product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews-container',
  imports: [ReviewForm, ReviewComponent, CommonModule],
  templateUrl: './reviews-container.html',
  styleUrl: './reviews-container.css',
})
export class ReviewsContainer {
  @Input() comments: productComment[] = [];

}
