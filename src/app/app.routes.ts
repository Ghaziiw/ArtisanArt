import { Routes } from '@angular/router';
import { Profile } from './features/profile/profile';
import { LoginPage } from './features/login-sign-up/components/login-page/login-page';
import { SignUpPage } from './features/login-sign-up/components/sign-up-page/sign-up-page';
import { ArtisanProfile } from './features/artisan-profile/artisan-profile';
import { Cart } from './features/cart/cart';
import { AdminCtrlPage } from './features/admin-ctrl-page/admin-ctrl-page';
import { MyStore } from './features/artisan-dashboard/my-store';
import { ProductPage } from './features/product-page/product-page';
import { AboutPage } from './features/about-page/about-page';
import { HowItWorks } from './features/how-it-works/how-it-works';
import { Faq } from './features/faq/faq';
import { TermsOfUse } from './features/terms-of-use/terms-of-use';

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
    path: 'my-store',
    component: MyStore,
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
    path: 'product-page/:id',
    component: ProductPage,
  },
  {
    path: 'about',
    component: AboutPage,
  },
  {
    path: 'how-it-works',
    component: HowItWorks,
  },
  {
    path: 'faq',
    component: Faq,
  },
  {
    path: 'terms-of-use',
    component: TermsOfUse,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
