import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-about',
  templateUrl: './about-page.html',
  styleUrls: ['./about-page.css'],
  imports: [Header, Footer],
  standalone: true
})
export class AboutPage {}
