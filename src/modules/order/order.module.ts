import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { ShoppingCartModule } from '../shoppingcart/shoppingcart.module';
import { ShoppingCart } from '../shoppingcart/shoppingcart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, ShoppingCart]),
    ShoppingCartModule, // Import ShoppingCartModule to use its services
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
