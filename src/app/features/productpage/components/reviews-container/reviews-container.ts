import { Component } from '@angular/core';
import { ReviewForm } from '../review-form/review-form';
import { ReviewComponent } from '../review/review';

@Component({
  selector: 'app-reviews-container',
  imports: [ReviewForm, ReviewComponent],
  templateUrl: './reviews-container.html',
  styleUrl: './reviews-container.css',
})
export class ReviewsContainer {

}
