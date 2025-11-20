import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface User {
  fullName: string;
  email: string;
  location: string;
}

@Component({
  selector: 'app-personal-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css'],
})
export class PersonalInfo {
  @ViewChild('infoForm') infoForm!: NgForm;
  @ViewChild('passwordForm') passwordForm!: NgForm;

  user: User = {
    fullName: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    location: 'Paris, France'
  };

  test() {
  console.log('CLICKED');
  alert('clicked!');
}

  showPasswordForm : boolean = false;

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  openPasswordForm(): void {
    this.showPasswordForm = true;
  }
  closePasswordForm():void{
    this.showPasswordForm = false;
  }

  onSubmit(): void {
    //add info updates here
    if (this.infoForm.valid) {
      console.log('Saved:', this.user);
      alert('Changes saved!');
    }
  }

  onPasswordSubmit(): void {
    if (this.password.new !== this.password.confirm) return;

    console.log('Password change:', this.password);
    alert('Password updated!');
    this.showPasswordForm = false;
    this.password = { current: '', new: '', confirm: '' };
  }
}