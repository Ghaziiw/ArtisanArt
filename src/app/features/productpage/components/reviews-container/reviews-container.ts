import { Component, Input, Output } from '@angular/core';
import { ProductComment } from '../../../../core/models';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reviews-container',
  imports: [ CommonModule, FormsModule],
  templateUrl: './reviews-container.html',
  styleUrl: './reviews-container.css',
})
export class ReviewsContainer {
  @Input() comments: ProductComment[] = [];
  @Output() feedback = new EventEmitter<{mark: number, content: string}>();

  stars = [1, 2, 3, 4, 5];
  mark : number = 0 ;
  content : string  = '' ;
  
  setRating( star: number ) {
    console.log("clicked");
    this.mark = star ;
  }

  //after clicking on "publier l'avis"
  submit() {
    this.feedback.emit({ mark : this.mark, content : this.content });
    console.log('Envoi du feedback:', this.mark, this.content);
    this.mark = 0 ;
    this.content = '' ;
  }

  //display stars dynamically
  getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

  //right format for date
  dateOnly(date: string): string{
    return date.substring(0,10);
  }
}
