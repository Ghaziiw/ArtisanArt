import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { CraftsmanModule } from './modules/craftsman/craftsman.module';
import { UserEntity } from './modules/user/user.entity';
import { CraftsmanEntity } from './modules/craftsman/craftsman.entity';
import { ProductEntity } from './modules/product/product.entity';
import { CategoryEntity } from './modules/category/category.entity';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [UserEntity, CraftsmanEntity, CategoryEntity, ProductEntity],
      synchronize: true,
      // migrationsRun: false,
    }), // Database configuration
    UserModule, // Import UserModule
    CraftsmanModule, // Import CraftsmanModule
    CategoryModule, // Import CategoryModule
    ProductModule, // Import ProductModule
    AuthModule.forRoot({
      auth,
      isGlobal: true, // Make auth module global
      disableGlobalAuthGuard: true, // Disable default global auth guard
    }), // Configure better-auth with the auth instance
  ],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD, // Apply PermissionsGuard globally
    //   useClass: PermissionsGuard, // Custom permissions guard
    // },
  ],
  controllers: [AppController], // Import the AppController
})
export class AppModule {}
