import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { ShoppingCartModule } from '../shoppingcart/shoppingcart.module';
import { ShoppingCart } from '../shoppingcart/shoppingcart.entity';
import { ProductModule } from '../product/product.module';
import { CraftsmanExpirationModule } from 'src/auth/guards/craftsman-expiration.module';
import { Craftsman } from '../craftsman/craftsman.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, ShoppingCart, Craftsman]), // Craftsman added for guard usage
    ShoppingCartModule, // Import ShoppingCartModule to use its services
    ProductModule, // Import ProductModule to use ProductService
    CraftsmanExpirationModule, // Import CraftsmanExpirationModule to use CraftsmanExpirationGuard
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
