import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig), // Database configuration
    AuthModule.forRoot({
      auth,
      isGlobal: true, // Make AuthModule global
      disableGlobalAuthGuard: true, // Disable default global auth guard
    }),
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
