import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CraftsmanEntity } from './craftsman.entity';
import { CraftsmanService } from './craftsman.service';
import { CraftsmanController } from './craftsman.controller';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CraftsmanEntity, UserEntity])],
  providers: [CraftsmanService],
  controllers: [CraftsmanController],
  exports: [CraftsmanService],
})
export class CraftsmanModule {}
