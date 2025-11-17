import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { Offer } from '../offer/offer.entity';
import { CategoryModule } from '../category/category.module';
import { CraftsmanExpirationModule } from 'src/auth/guards/craftsman-expiration.module';
import { Craftsman } from '../craftsman/craftsman.entity';
import { UploadModule } from '../upload/upload.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Offer, Craftsman]), // Craftsman added for guard usage
    CategoryModule, // Import CategoryModule to use CategoryService
    CraftsmanExpirationModule, // Import CraftsmanExpirationModule to use CraftsmanExpirationGuard
    UploadModule, // Import UploadModule to use UploadService
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
