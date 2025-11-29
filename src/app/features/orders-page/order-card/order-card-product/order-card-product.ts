import { Component, Input } from '@angular/core';
import { OrderItem } from '../../../../core/models';

@Component({
  selector: 'app-order-card-product',
  templateUrl: './order-card-product.html',
  styleUrls: ['./order-card-product.css'],
})
export class OrderCardProduct {
  @Input() item!: OrderItem;

  get totalPrice() {
    return this.item.quantity * parseFloat(this.item.priceAtOrder);
  }

  get priceAtOrder() {
    return parseFloat(this.item.priceAtOrder);
  }
}
