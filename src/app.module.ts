import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './config/database.config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { CraftsmanModule } from './craftsman/craftsman.module';
import { UserEntity } from './user/user.entity';
import { CraftsmanEntity } from './craftsman/craftsman.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [UserEntity, CraftsmanEntity],
      synchronize: true,
      // migrationsRun: false,
    }), // Database configuration
    AuthModule.forRoot({ auth }),
    UserModule, // Import UserModule
    CraftsmanModule, // Import CraftsmanModule
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // Apply PermissionsGuard globally
      useClass: PermissionsGuard, // Custom permissions guard
    },
  ],
  controllers: [AppController], // Import the AppController
})
export class AppModule {}
