import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CraftsmanExpirationGuard } from './craftsman-expiration.guard';
import { Craftsman } from 'src/modules/craftsman/craftsman.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Craftsman])],
  providers: [CraftsmanExpirationGuard],
  exports: [CraftsmanExpirationGuard],
})
export class CraftsmanExpirationModule {}
