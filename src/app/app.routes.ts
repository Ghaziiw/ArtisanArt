import { Routes } from '@angular/router';
import { Profile } from './features/profile/profile';
import { LoginPage } from './features/login-sign-up/components/login-page/login-page';
import { SignUpPage } from './features/login-sign-up/components/sign-up-page/sign-up-page';
import { ArtisanProfile } from './features/artisan-profile/artisan-profile';
import { Cart } from './features/cart/cart';
import { AdminCtrlPage } from './features/admin-ctrl-page/admin-ctrl-page';

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
    path: 'artisan-profile/:id',
    component: ArtisanProfile,
  },
  {
    path: 'cart',
    component: Cart,
  },
  {
    path: 'admin-panel',
    component: AdminCtrlPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
