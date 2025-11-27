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
  mark : number = 0 ;
  content : string  = '' ;
  @Output() feedback = new EventEmitter<{mark: number, content: string}>();
  
  setRating( star: number ) {
    this.mark = star ;
  }

  submit() {
    this.feedback.emit({ mark : this.mark, content : this.content });
    console.log('Envoi du feedback:', this.mark, this.content);
    this.mark = 0 ;
    this.content = '' ;
  }

}
