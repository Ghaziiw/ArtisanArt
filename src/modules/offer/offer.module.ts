import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { Product } from '../product/product.entity';
import { CraftsmanExpirationModule } from 'src/auth/guards/craftsman-expiration.module';
import { Craftsman } from '../craftsman/craftsman.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Product, Craftsman]), // Craftsman added for guard usage
    CraftsmanExpirationModule, // Import CraftsmanExpirationModule to use CraftsmanExpirationGuard
  ],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
