import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UpdateProfileDto, User } from '../../../core/models';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-personal-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css'],
})
export class PersonalInfo implements OnChanges {
  allowDeletion=false;
  @Input() user!: User;
  @ViewChild('infoForm') infoForm!: NgForm;

  // State variables
  localUser!: User;
  password = { current: '', new: '', confirm: '' };
  showPasswordForm = false;
  isSaving = false;
  saveError = '';

  constructor(private userService: UserService) {}

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

    this.userService.updateProfile(data).subscribe({
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

    // API Call to change password
    this.userService
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

  deleteProfile(): void {
    const confirmed = confirm('Are you sure you want to delete your profile? This action cannot be undone.');
    if (!confirmed) return;

    this.userService.deleteMyProfile().subscribe({
      next: () => {
        alert('Profile deleted successfully.');
        window.location.href = '/';
      },
      error: (err) => {
        console.error('Failed to delete profile:', err);
        alert('Failed to delete profile. Please try again.');
      },
    });
  }
}