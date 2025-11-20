import { Component, Input } from '@angular/core';
import { User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-pic',
  imports: [],
  templateUrl: './profile-pic.html',
  styleUrl: './profile-pic.css',
})
export class ProfilePic {
  @Input() user!: User; // User passed from parent component

  // Get profile image or default
  get profileImage(): string {
    console.log('User image:', this.user?.image);
    return this.user?.image || '/assets/images/seller1.jpg';
  }

  // Handle photo upload
  onUploadPhoto() {
    // Logique pour uploader une photo
    console.log('Upload photo clicked');
  }

  // Handle photo deletion
  onDeletePhoto() {
    // Logique pour supprimer une photo
    console.log('Delete photo clicked');
  }
}
