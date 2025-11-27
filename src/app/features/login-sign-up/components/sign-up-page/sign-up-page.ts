import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../../shared/components/header/header';
import {
  SignupService,
  ClientSignUpDto,
  CraftsmanSignUpDto,
} from '../../../../core/services/signup.service';
import { AuthService } from '../../../../core/services/auth.service';
import { set } from 'better-auth';
import { Footer } from "../../../../shared/components/footer/footer";

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [Header, FormsModule, CommonModule, Footer],
  templateUrl: './sign-up-page.html',
  styleUrls: ['./sign-up-page.css'],
})
export class SignUpPage implements AfterViewInit {
  @ViewChild('artisanInfo') artisanInfoRef?: ElementRef<HTMLElement>;

  // Basic credentials
  credentials = {
    fullname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    location: '',
  };

  // Professional information for artisans
  professionalInfo: {
    workshopName: string;
    specialty: string;
    biography: string;
    phone: string;
    address: string;
    deliveryPrice: string;
    instagram: string;
    facebook: string;
    profilePhotoUrl: string;
    profilePhotoFile: File | null;
  } = {
    workshopName: '',
    specialty: '',
    biography: '',
    phone: '',
    address: '',
    deliveryPrice: '',
    instagram: '',
    facebook: '',
    profilePhotoUrl: '',
    profilePhotoFile: null,
  };

  // State variables
  selectedUserType: string = 'client';
  signUpError: string = '';
  fileError: string = '';
  isSubmitting: boolean = false;

  constructor(
    private signupService: SignupService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit() {}

  /**
   * Select user type (client or artisan)
   */
  selectUserType(type: string) {
    if (type === 'client') {
      // start hide animation only if element exists
      const el = this.artisanInfoRef?.nativeElement;
      if (el) {
        el.classList.add('hide');
        el.addEventListener(
          'animationend',
          () => {
            // remove element by changing selectedUserType AFTER animation
            this.selectedUserType = 'client'; // provoque *ngIf removal
          },
          { once: true }
        );
      } else {
        this.selectedUserType = 'client';
      }
    } else {
      this.selectedUserType = 'artisan';
      // ViewChild va être mis à jour après change detection, tu peux setTimeout 0 si besoin
    }
  }

  /**
   * Check if a user type is selected
   */
  isSelected(type: string): boolean {
    return this.selectedUserType === type;
  }

  /**
   * Handle file selection for profile photo
   */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        this.fileError = 'Please upload a PNG or JPG image';
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        this.fileError = 'Image must be less than 1 MB';
        setTimeout(() => {
          this.fileError = '';
        }, 5000);
        return;
      }

      this.fileError = '';

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.professionalInfo.profilePhotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      // Store file
      this.professionalInfo.profilePhotoFile = file;
    }
  }

  /**
   * Submit sign-up form
   */
  async onSubmit(form: NgForm) {
    if (!form.valid) {
      this.signUpError = 'Please fill in all required fields';
      setTimeout(() => {
        this.signUpError = '';
      }, 5000);
      return;
    }

    // Validate passwords match
    if (this.credentials.password !== this.credentials.passwordConfirm) {
      this.signUpError = 'Passwords do not match';
      setTimeout(() => {
        this.signUpError = '';
      }, 5000);
      return;
    }

    // Validate password length
    if (this.credentials.password.length < 8) {
      this.signUpError = 'Password must be at least 8 characters long';
      setTimeout(() => {
        this.signUpError = '';
      }, 5000);
      return;
    }

    this.isSubmitting = true;
    this.signUpError = '';

    try {
      if (this.selectedUserType === 'client') {
        await this.signUpAsClient();
      } else {
        await this.signUpAsArtisan();
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      this.signUpError = error?.error?.message || 'Sign up failed. Please try again.';
      this.isSubmitting = false;
      setTimeout(() => {
        this.signUpError = '';
      }, 5000);
    }
  }

  /**
   * Sign up as a client
   */
  private async signUpAsClient() {
    const clientData: ClientSignUpDto = {
      email: this.credentials.email,
      password: this.credentials.password,
      name: this.credentials.fullname,
      location: this.credentials.location || undefined,
    };

    this.signupService.signUpClient(clientData).subscribe({
      next: (response) => {
        console.log('Client sign up successful:', response);

        // Reload session after sign up
        this.authService.getSession().subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            console.error('Failed to load session:', err);
            this.isSubmitting = false;
            // Navigate anyway since signup was successful
            this.router.navigate(['/profile']);
          },
        });
      },
      error: (err) => {
        console.error('Client sign up failed:', err);
        this.signUpError = err.error?.message || 'Failed to create account.';
        this.isSubmitting = false;
        setTimeout(() => {
          this.signUpError = '';
        }, 5000);
      },
    });
  }

  /**
   * Sign up as an artisan
   */
  private async signUpAsArtisan() {
    // Validate artisan-specific fields
    if (
      !this.professionalInfo.workshopName ||
      !this.professionalInfo.phone ||
      !this.professionalInfo.address ||
      !this.professionalInfo.deliveryPrice
    ) {
      this.signUpError = 'Please fill in all required professional information';
      this.isSubmitting = false;
      setTimeout(() => {
        this.signUpError = '';
      }, 5000);
      return;
    }

    const craftsmanData: CraftsmanSignUpDto = {
      email: this.credentials.email,
      password: this.credentials.password,
      name: this.credentials.fullname,
      location: this.credentials.location || undefined,
      businessName: this.professionalInfo.workshopName,
      phone: this.professionalInfo.phone,
      workshopAddress: this.professionalInfo.address,
      deliveryPrice: parseFloat(this.professionalInfo.deliveryPrice),
      bio: this.professionalInfo.biography || undefined,
      specialty: this.professionalInfo.specialty || undefined,
      instagram: this.professionalInfo.instagram || undefined,
      facebook: this.professionalInfo.facebook || undefined,
      profileImage: this.professionalInfo.profilePhotoFile || undefined,
    };

    this.signupService.signUpCraftsman(craftsmanData).subscribe({
      next: (response) => {
        console.log('Craftsman sign up successful:', response);

        // Reload session after sign up
        this.authService.getSession().subscribe({
          next: () => {
            setTimeout(() => {
              this.authService
                .login(this.credentials.email, this.credentials.password)
                .then(() => {
                  this.isSubmitting = false;
                  this.router.navigate(['/profile']);
                })
                .catch((err) => {
                  console.error('Auto-login failed:', err);
                  this.isSubmitting = false;
                  this.router.navigate(['/login']);
                });
            }, 500);
          },
          error: (err) => {
            console.error('Failed to load session:', err);
            this.isSubmitting = false;
            // Navigate anyway since signup was successful
            this.router.navigate(['/profile']);
          },
        });
      },
      error: (err) => {
        console.error('Craftsman sign up failed:', err);
        this.signUpError = err.error?.message || 'Failed to create craftsman account.';
        this.isSubmitting = false;
        setTimeout(() => {
          this.signUpError = '';
        }, 5000);
      },
    });
  }

  /**
   * Navigate to login page
   */
  onSignUpClick(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
