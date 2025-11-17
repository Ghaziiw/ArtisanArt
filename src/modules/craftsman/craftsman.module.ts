import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Craftsman } from '../craftsman/craftsman.entity';
import { CraftsmanService } from './craftsman.service';
import { CraftsmanController } from './craftsman.controller';
import { User } from 'src/modules/user/user.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Craftsman, User]), UploadModule],
  providers: [CraftsmanService],
  controllers: [CraftsmanController],
  exports: [CraftsmanService],
})
export class CraftsmanModule {}
