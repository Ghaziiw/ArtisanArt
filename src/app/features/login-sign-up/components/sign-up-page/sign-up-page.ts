import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Header } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [Header  ,FormsModule, CommonModule],
  templateUrl: './sign-up-page.html',
  styleUrls: ['./sign-up-page.css'],
})
export class SignUpPage {
  credentials = { fullname: '', email: '', password: '' , passwordConfirm: ''};
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
    profilePhotoFile: null
  };
  signUpError: string = '';
  fileError: string = '';
  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.signUpError = '';

    try {
      const result = await this.authService.login(this.credentials.email, this.credentials.password);

      // Si Better Auth renvoie un objet Data, il contient user
      if ('user' in result) {
        // login réussi
        this.router.navigate(['/profile']);
      } else {
        // login échoué
        this.signUpError = 'Email ou mot de passe invalide';
      }

    } catch (error: any) {
      console.error(error);
      this.signUpError = error?.message || 'Échec de la connexion';
    }
  }


  onSignUpClick(event: Event) {
    event.preventDefault();
    // Navigation vers signup
    this.router.navigate(['/login']);
  }



  selectedUserType: string = 'client';

  selectUserType(type: string): void {
    this.selectedUserType = type;
    console.log('Selected user type:', this.selectedUserType);
  }

  isSelected(type: string): boolean {
    return this.selectedUserType === type;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        this.fileError = 'Please upload a PNG or JPG image';
        return;
      }
      if (file.size > 1024 * 1024) {
        this.fileError = 'Image must be less than 1 MB';
        return;
      }

      this.fileError = '';

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.professionalInfo.profilePhotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.professionalInfo.profilePhotoFile = file;
    }
  }
}
