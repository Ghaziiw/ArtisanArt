import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.css'],
  standalone: true,
  imports: [Header, Footer, CommonModule]
})
export class PrivacyPolicy {
  title: string = "Privacy Policy";

  sections = [
    {
      heading: "1. Introduction",
      content: "At ArtisanArt, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information."
    },
    {
      heading: "2. Information We Collect",
      content: "We may collect personal information such as your name, email address, and phone number when you register an account, make purchases, or interact with our platform."
    },
    {
      heading: "3. How We Use Your Information",
      content: "We use your information to provide and improve our services, communicate with you, process transactions, and personalize your experience."
    },
    {
      heading: "4. Sharing Your Information",
      content: "We do not sell your personal information. We may share data with trusted service providers who help us operate the platform or comply with legal obligations."
    },
    {
      heading: "5. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, disclosure, or loss."
    },
    {
      heading: "6. Your Rights",
      content: "You have the right to access, update, or delete your personal data. You may also object to certain processing of your information."
    },
    {
      heading: "7. Cookies and Tracking",
      content: "Our platform uses cookies and similar technologies to enhance your browsing experience and analyze site usage."
    },
    {
      heading: "8. Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. Continued use of ArtisanArt constitutes acceptance of the updated policy."
    },
    {
      heading: "9. Contact Us",
      content: "If you have questions about this Privacy Policy, please contact us at privacy@artisanart.com."
    }
  ];
}
