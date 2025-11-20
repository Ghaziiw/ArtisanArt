import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { ProfilePic } from "./profile-pic/profile-pic";
import { PersonalInfo } from './personal-info/personal-info';

@Component({
  selector: 'app-profile',
  imports: [Header, ProfilePic,PersonalInfo],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}
