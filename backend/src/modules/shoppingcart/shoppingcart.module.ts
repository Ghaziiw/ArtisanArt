import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shoppingcart.service';
import { ShoppingCartController } from './shoppingcart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './shoppingcart.entity';
import { Product } from '../product/product.entity';
import { Craftsman } from '../craftsman/craftsman.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingCart, Product, Craftsman]),
    ProductModule,
  ],
  providers: [ShoppingCartService],
  controllers: [ShoppingCartController],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
