import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quantity',
  imports: [],
  templateUrl: './quantity.html',
  styleUrl: './quantity.css',
})
export class Quantity {
@Input() quantity: number = 1;
@Output() quantityChange = new EventEmitter<number>();


  increment() {
  this.quantity++;
  this.quantityChange.emit(this.quantity);
  }


  decrement() {
    if (this.quantity > 1) {
    this.quantity--;
    this.quantityChange.emit(this.quantity);
    }
  }
}
