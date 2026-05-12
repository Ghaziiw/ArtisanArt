import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Craftsman } from '../../../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artisan-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artisan-card.html',
  styleUrls: ['./artisan-card.css'],
})
export class ArtisanCard {
  @Input() craftsman!: Craftsman;

  constructor(private router: Router) {}

  goToProfile(): void {
    if (this.craftsman?.userId) {
      this.router.navigate(['/artisan-profile', this.craftsman.userId]);
    }
  }

  get displayName(): string {
    return this.craftsman?.businessName || 'Unknown Artisan';
  }

  get displaySpecialty(): string {
    return this.craftsman?.specialty || 'Artisan';
  }

  get description(): string {
    return this.craftsman?.bio || 'No description available.';
  }

  get location(): string {
    return this.craftsman?.workshopAddress || 'Unknown Location';
  }

  get profileImage(): string {
    return this.craftsman?.profileImage || '/assets/images/seller1.jpg';
  }

  get rating(): number {
    return this.craftsman?.avgRating || 0;
  }

  get totalComments(): number {
    return this.craftsman?.totalComments || 0;
  }

  get deliveryPrice(): string {
    return this.craftsman?.deliveryPrice
      ? `$${parseFloat(this.craftsman.deliveryPrice).toFixed(2)}`
      : '$0.00';
  }
}
