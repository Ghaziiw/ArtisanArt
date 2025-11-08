import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CraftsmanEntity } from '../craftsman/craftsman.entity';
import { CraftsmanService } from './craftsman.service';
import { CraftsmanController } from './craftsman.controller';
import { UserEntity } from 'src/modules/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CraftsmanEntity, UserEntity])],
  providers: [CraftsmanService],
  controllers: [CraftsmanController],
  exports: [CraftsmanService],
})
export class CraftsmanModule {}
