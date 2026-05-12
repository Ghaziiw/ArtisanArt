import { Component, OnInit } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { ProfilePic } from './profile-pic/profile-pic';
import { PersonalInfo } from './personal-info/personal-info';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-profile',
  imports: [Header, ProfilePic, PersonalInfo, CommonModule, Footer],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {
  user!: User;

  constructor(private authService: AuthService) {}

  // Load user on init
  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user!;
      console.log('Parent received user:', user);
    });
  }
}
