import { Component, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile-pic',
  imports: [CommonModule],
  templateUrl: './profile-pic.html',
  styleUrl: './profile-pic.css',
})
export class ProfilePic implements OnChanges {
  @Input() user!: User;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>; // Hidden file input reference

  // State variables
  isUploading = false;
  isDeleting = false;
  uploadError = '';
  currentImage = '';

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.currentImage = this.user?.image || '/assets/images/seller1.jpg';
    console.log('ProfilePic - ngOnChanges - user image:', this.currentImage);
  }

  /**
   * Get profile image or default
   */
  get profileImage(): string {
    return this.currentImage;
  }

  /**
   * Trigger file input click
   */
  onUploadPhoto(): void {
    // Create a hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        this.uploadProfileImage(file);
      }

      // Clean up
      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  }

  /**
   * Upload profile image
   */
  private uploadProfileImage(file: File): void {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Please select a valid image file.';
      return;
    }

    // Validate file size (e.g., max 1MB)
    const maxSize = 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      this.uploadError = 'Image size must be less than 1MB.';
      return;
    }

    this.isUploading = true;
    this.uploadError = '';

    this.userService.updateProfileImage(file).subscribe({
      next: (response) => {
        console.log('Profile image uploaded successfully:', response);

        const imageUrl = response.image
          ? `${response.image}?t=${Date.now()}`
          : '/assets/images/seller1.jpg';
        this.currentImage = imageUrl;
        this.user.image = imageUrl;

        this.isUploading = false;
        this.isDeleting = false;
      },
      error: (err) => {
        console.error('Failed to upload profile image:', err);
        this.uploadError = err.error?.message || 'Failed to upload image. Please try again.';
        this.isUploading = false;
        this.isDeleting = false;

        setTimeout(() => {
          this.uploadError = '';
        }, 5000);
      },
    });
  }

  /**
   * Delete profile photo
   */
  onDeletePhoto(): void {
    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    this.isDeleting = true;
    this.uploadError = '';

    this.userService.deleteProfileImage().subscribe({
      next: (response) => {
        console.log('Profile image deleted successfully:', response);
        this.isDeleting = false;
      },
      error: (err) => {
        console.error('Failed to delete profile image:', err);
        this.uploadError = err.error?.message || 'Failed to delete image. Please try again.';
        this.isDeleting = false;

        // Clear error after 5 seconds
        setTimeout(() => {
          this.uploadError = '';
        }, 5000);
      },
    });
  }
}
