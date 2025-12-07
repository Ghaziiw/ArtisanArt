import { Component, Input, Output } from '@angular/core';
import { ProductComment } from '../../../../core/models';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../../core/services/comment.service';

@Component({
  selector: 'app-reviews-container',
  imports: [ CommonModule, FormsModule],
  templateUrl: './reviews-container.html',
  styleUrl: './reviews-container.css',
})
export class ReviewsContainer {
  @Input() comments: ProductComment[] = [];
  @Input() productId!: string;
  @Output() commentAdded = new EventEmitter<void>(); // Changement: émettre juste un signal de rafraîchissement

  constructor(private commentService: CommentService) {}

  stars = [1, 2, 3, 4, 5];
  mark: number = 0;
  content: string = '';
  isSubmitting: boolean = false; // Pour éviter les doubles soumissions

  // Message properties
  showMessage: boolean = false;
  message: { type: 'success' | 'error'; text: string } = { type: 'success', text: '' };
  isHiding = false;
  
  setRating(star: number) {
    this.mark = star;
  }

  // Validation du formulaire
  isFormValid(): boolean {
    return this.mark > 0 && this.content.trim().length > 0;
  }

  // Afficher un message
  private displayMessage(type: 'success' | 'error', text: string) {
    this.showMessage = true;
    this.message = { type, text };
    this.isHiding = false;

    setTimeout(() => {
      this.isHiding = true;
      setTimeout(() => {
        this.showMessage = false;
      }, 500);
    }, 5000);
  }

  // Après avoir cliqué sur "publier l'avis"
  submit() {
    // Validation
    if (!this.isFormValid()) {
      this.displayMessage('error', 'Please provide a rating and a comment.');
      return;
    }

    // Empêcher les doubles soumissions
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.commentService.addComment({
      mark: this.mark, 
      content: this.content, 
      productId: this.productId
    }).subscribe({
      next: (response) => {
        this.displayMessage('success', 'Comment submitted successfully!');
        
        // Émettre un signal pour que le parent recharge les commentaires
        this.commentAdded.emit();
        
        // Réinitialiser le formulaire
        this.mark = 0;
        this.content = '';
        this.isSubmitting = false;
      },
      error: (error) => {
        this.displayMessage('error', error.error?.message || 'Failed to submit comment.');
        this.isSubmitting = false;
      }
    });
  }

  // Afficher les étoiles dynamiquement
  getStarsArray(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

  // Format de date correct
  dateOnly(date: string): string {
    return date.substring(0, 10);
  }
}