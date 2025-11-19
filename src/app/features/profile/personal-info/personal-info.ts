import { Component, NgModule, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface User {
  fullName: string;
  email: string;
  location: string;
}

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css'],
  imports:[FormsModule],
})
export class PersonalInfo {
  @ViewChild('infoForm') infoForm!: NgForm;

  user: User = {
    fullName: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    location: 'Paris, France'
  };

  onSubmit(): void {
    if (this.infoForm.valid) {
      console.log('Informations sauvegardées :', this.user);
      alert('Modifications enregistrées avec succès !');
      // TODO: call API here
    }
  }

  onChangePassword(): void {
    console.log('Ouvrir le modal de changement de mot de passe');
    // this.router.navigate(['/change-password']);
    // or open a modal
  }
}