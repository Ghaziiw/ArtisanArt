import { Component, Input, Output } from '@angular/core';
import { ReviewForm } from '../review-form/review-form';
import { ReviewComponent } from '../review/review';
import { Comment as productComment } from '../../../../core/services/specific-product.service';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reviews-container',
  imports: [ReviewForm, ReviewComponent, CommonModule],
  templateUrl: './reviews-container.html',
  styleUrl: './reviews-container.css',
})
export class ReviewsContainer {
  @Input() comments: productComment[] = [];
  @Output() feedback = new EventEmitter<{mark: number , content: string}>();

    onFeedback(event: {mark: number, content: string}) {
    this.feedback.emit(event); 
  }

}
