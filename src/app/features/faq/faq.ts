import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styleUrls: ['./faq.css'],
  standalone: true,
  imports: [Header, Footer, CommonModule]
})
export class Faq {
  faqs: FaqItem[] = [
    {
      question: 'How do I place an order?',
      answer: 'Browse products or artisans, select your items, add them to your cart, and proceed to checkout.',
      open: false
    },
    {
      question: 'Can I support multiple artisans in one order?',
      answer: 'Yes, you can add products from different artisans to your cart and place a single order.',
      open: false
    },
    {
      question: 'How is payment handled?',
      answer: 'All payments are securely processed through our integrated payment gateway.',
      open: false
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes, once your order is shipped, you will receive a tracking number to monitor delivery.',
      open: false
    },
    {
      question: 'How can I become an artisan on ArtisanArt?',
      answer: 'Sign up as an artisan, complete your profile, and start listing your handmade products.',
      open: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
