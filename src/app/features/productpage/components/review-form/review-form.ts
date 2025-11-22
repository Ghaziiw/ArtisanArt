import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-review-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
})
export class ReviewForm {
  stars = [1, 2, 3, 4, 5];
  rating : number = 0 ;
  comment : string  = '' ;
  @Output() feedback = new EventEmitter<{rating: number, comment: string}>();
  
  setRating( star: number ) {
    this.rating = star ;
  }

  submit() {
    this.feedback.emit({ rating : this.rating, comment : this.comment });
    this.rating = 0 ;
    this.comment = '' ;
  }

}
