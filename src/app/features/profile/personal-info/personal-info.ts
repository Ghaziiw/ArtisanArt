import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/services/auth.service';
import { ProfileService, UpdateProfileDto } from '../../../core/services/profile.service';

@Component({
  selector: 'app-personal-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css'],
})
export class PersonalInfo implements OnChanges {
  @Input() user!: User;
  @ViewChild('infoForm') infoForm!: NgForm;

  // State variables
  localUser!: User;
  password = { current: '', new: '', confirm: '' };
  showPasswordForm = false;
  isSaving = false;
  saveError = '';

  constructor(private profileService: ProfileService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.localUser = { ...this.user }; // copie locale pour édition
    }
  }

  openPasswordForm(): void {
    this.showPasswordForm = true;
  }

  closePasswordForm(): void {
    const formEl = document.querySelector('.password-change-form') as HTMLElement;
    if (!formEl) return;

    formEl.classList.add('hide');
    formEl.addEventListener(
      'animationend',
      () => {
        this.showPasswordForm = false;
        formEl.classList.remove('hide');
      },
      { once: true }
    );
  }

  // Update personal information
  onSubmit(): void {
    if (!this.infoForm.valid) return;

    this.isSaving = true;
    this.saveError = '';

    const data: UpdateProfileDto = {
      name: this.localUser.name,
      email: this.localUser.email,
      location: this.localUser.location,
    };

    this.profileService.updateProfile(data).subscribe({
      next: (updatedUser) => {
        this.localUser = { ...updatedUser }; // update local copy
        this.isSaving = false;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Failed to update info:', err);
        this.saveError = err.error?.message || 'Failed to update profile';
        this.isSaving = false;

        setTimeout(() => (this.saveError = ''), 5000);
      },
    });
  }

  passwordError = '';

  // Change password
  onPasswordSubmit(): void {
    if (this.password.new.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long';
      setTimeout(() => (this.passwordError = ''), 5000);
      return;
    }

    if (this.password.new !== this.password.confirm) {
      this.passwordError = 'Passwords do not match!';
      setTimeout(() => (this.passwordError = ''), 5000);
      return;
    }

    // Appel API
    this.profileService
      .changePassword({
        currentPassword: this.password.current,
        newPassword: this.password.new,
      })
      .subscribe({
        next: () => {
          alert('Password updated successfully!');
          this.closePasswordForm();
          this.password = { current: '', new: '', confirm: '' };
        },
        error: (err) => {
          this.passwordError = err.error?.message || 'Failed to update password';
          setTimeout(() => (this.passwordError = ''), 5000);
        },
      });
  }
}
