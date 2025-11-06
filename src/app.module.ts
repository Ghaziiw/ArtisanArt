import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig), // Database configuration
    AuthModule.forRoot({ auth }), // BetterAuth configuration
  ],
})
export class AppModule {}
