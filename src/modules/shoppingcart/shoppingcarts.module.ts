import { Module } from '@nestjs/common';
import { ShoppingcartsService } from './shoppingcarts.service';
import { ShoppingcartsController } from './shoppingcarts.controller';

@Module({
  controllers: [ShoppingcartsController],
  providers: [ShoppingcartsService],
})
export class ShoppingcartsModule {}
