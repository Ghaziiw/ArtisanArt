import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderCardProduct } from "./order-card-product/order-card-product";
import { Craftsman, Order, OrderStatusRequest } from '../../../core/models';

@Component({
  selector: 'app-order-card',
  imports: [CommonModule, OrderCardProduct],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard implements OnChanges {

  @Input() orderDetails!: { order: Order; craftsman: Craftsman };

  finishedOrder = false;
  displayAllInfo = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderDetails']) {
      this.finishedOrder = this.orderDetails.order.status === OrderStatusRequest.DELIVERED || this.orderDetails.order.status === OrderStatusRequest.CANCELLED;
    }
  }

  get totalPrice() {
    const total = this.subTotalPrice;

    const delivery = parseFloat(this.orderDetails.order.deliveryPrice);

    return total + delivery;
  }

  get subTotalPrice() {
    let total = 0;

    for (let item of this.orderDetails.order.items) {
      total += item.quantity * parseFloat(item.priceAtOrder);
    }

    return total;
  }
}
