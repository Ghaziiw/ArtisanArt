import { Component, Input } from '@angular/core';
import { Product } from '../../../../../core/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-display',
  imports: [CommonModule],
  templateUrl: './item-display.html',
  styleUrl: './item-display.css',
})
export class ItemDisplay {
  @Input() product!: Product; // Input property to receive product data
}
