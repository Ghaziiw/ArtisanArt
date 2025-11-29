import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrderCardProduct } from "./order-card-product/order-card-product";

@Component({
  selector: 'app-order-card',
  imports: [CommonModule, OrderCardProduct],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  finishedOrder=false;
  displayAllInfo=false;
}
