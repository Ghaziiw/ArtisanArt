import { Component } from '@angular/core';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.html',
  styleUrls: ['./terms-of-use.css'],
  standalone: true,
  imports: [Footer, Header, CommonModule],
})
export class TermsOfUse {
  title: string = 'Terms of Use';

  sections = [
    {
      heading: '1. Introduction',
      content:
        'Welcome to ArtisanArt. By accessing or using our platform, you agree to comply with these Terms of Use. Please read them carefully.',
    },
    {
      heading: '2. Use of the Platform',
      content:
        'You may use ArtisanArt only for lawful purposes and in accordance with these Terms. You agree not to misuse the platform or interfere with its functionality.',
    },
    {
      heading: '3. Account Registration',
      content:
        'To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.',
    },
    {
      heading: '4. User Content',
      content:
        'You retain ownership of content you post, such as artisan profiles or product descriptions, but you grant ArtisanArt a license to display it on the platform.',
    },
    {
      heading: '5. Prohibited Conduct',
      content:
        'You agree not to post illegal, offensive, or misleading content, and not to engage in fraud, harassment, or any activities that harm the platform or its users.',
    },
    {
      heading: '6. Intellectual Property',
      content:
        'All content on ArtisanArt, including text, images, and logos, is protected by intellectual property laws. You may not use it without permission.',
    },
    {
      heading: '7. Limitation of Liability',
      content:
        'ArtisanArt is not responsible for any damages resulting from the use of the platform. Users assume all risk when using the platform.',
    },
    {
      heading: '8. Modifications to Terms',
      content:
        'We may update these Terms of Use at any time. Your continued use of ArtisanArt constitutes acceptance of the updated terms.',
    },
    {
      heading: '9. Contact',
      content:
        'If you have any questions about these Terms of Use, please contact us at support@artisanart.com.',
    },
  ];
}
