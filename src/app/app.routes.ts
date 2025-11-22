import { Routes } from '@angular/router';
import { Profile } from './features/profile/profile';
import { LoginPage } from './features/login-sign-up/components/login-page/login-page';
import { SignUpPage } from './features/login-sign-up/components/sign-up-page/sign-up-page';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/homepage/homepage').then((m) => m.Homepage),
  },
  {
    path: 'profile',
    component: Profile,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'signup',
    component: SignUpPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
