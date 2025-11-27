import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { RouterLink } from '@angular/router';
import { CartProductCard } from './cart-product-card/cart-product-card';
import { CommonModule } from '@angular/common';
import { TunisianState } from '../../core/services/store.service';
import { FormsModule, NgForm } from "@angular/forms";
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-cart',
  imports: [Header, RouterLink, CartProductCard, CommonModule, FormsModule, Footer],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart {
  public tunisianStates: string[] = Object.values(TunisianState);
  deliveryInfo = {
    cin: '',
    location: '',
    city: '',
    phone: ''
  };

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    console.log('Form Data:', this.deliveryInfo);
    // Handle form submission here
  }
}
