import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { Offer } from '../offer/offer.entity';
import { CategoryModule } from '../category/category.module';
@Module({
  imports: [TypeOrmModule.forFeature([Product, Offer]), CategoryModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
