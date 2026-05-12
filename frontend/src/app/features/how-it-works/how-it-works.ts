import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.html',
  styleUrls: ['./how-it-works.css'],
  imports: [Header, Footer, CommonModule, RouterLink],
  standalone: true
})
export class HowItWorks {
  steps = [
    {
      title: 'Discover Artisans',
      description:
        'Browse through a curated list of talented local artisans and explore their handmade products.',
    },
    {
      title: 'Select Products',
      description: 'Choose the products you love, check their details, and add them to your cart.',
    },
    {
      title: 'Place an Order',
      description: 'Securely place your order and choose your preferred delivery method.',
    },
    {
      title: 'Support Local Artisans',
      description: 'Receive your handcrafted items and support local artisans directly.',
    },
  ];
}
