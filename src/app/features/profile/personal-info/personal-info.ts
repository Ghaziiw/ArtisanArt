import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-personal-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css'],
})
export class PersonalInfo implements OnChanges {
  @Input() user!: User; // Useer passed from parent component
  @ViewChild('infoForm') infoForm!: NgForm;

  password = { current: '', new: '', confirm: '' };
  showPasswordForm = false;

  constructor(private authService: AuthService) {}

  // Detect changes to the input user
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      // Tu peux copier les valeurs si tu veux éditer localement
      this.localUser = { ...this.user };
    }
  }

  localUser!: User;

  // Open and close password change form with animation
  openPasswordForm(): void {
    this.showPasswordForm = true;
  }
  closePasswordForm(): void {
    const formEl = document.querySelector('.password-change-form') as HTMLElement;
    if (!formEl) return;

    formEl.classList.add('hide');

    formEl.addEventListener('animationend', () => {
      this.showPasswordForm = false;
      formEl.classList.remove('hide');
    }, { once: true });
  }

  // Submit personal info form
  onSubmit(): void {
    if (!this.infoForm.valid) return;

    // this.authService.updateUser({
    //   name: this.localUser.name,
    //   email: this.localUser.email,
    //   location: this.localUser.location
    // }).subscribe({
    //   next: updatedUser => {
    //     console.log('User updated:', updatedUser);
    //     alert('Changes saved!');
    //   },
    //   error: err => {
    //     console.error(err);
    //     alert('Failed to update user info');
    //   }
    // });
  }

  // Submit password change form
  onPasswordSubmit(): void {
    if (this.password.new !== this.password.confirm) {
      alert('Passwords do not match!');
      return;
    }

    // this.authService.changePassword(this.password.current, this.password.new)
    //   .subscribe({
    //     next: () => {
    //       alert('Password updated!');
    //       this.closePasswordForm();
    //       this.password = { current: '', new: '', confirm: '' };
    //     },
    //     error: err => {
    //       console.error(err);
    //       alert('Failed to change password');
    //     }
    //   });
  }
}
