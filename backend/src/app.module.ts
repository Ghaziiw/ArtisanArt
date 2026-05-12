import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './utils/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { CraftsmanModule } from './modules/craftsman/craftsman.module';
import { User } from './modules/user/user.entity';
import { Craftsman } from './modules/craftsman/craftsman.entity';
import { Product } from './modules/product/product.entity';
import { Category } from './modules/category/category.entity';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { OfferModule } from './modules/offer/offer.module';
import { Offer } from './modules/offer/offer.entity';
import { CommentModule } from './modules/comment/comment.module';
import { Comment } from './modules/comment/comment.entity';
import { ShoppingCart } from './modules/shoppingcart/shoppingcart.entity';
import { ShoppingCartModule } from './modules/shoppingcart/shoppingcart.module';
import { Order } from './modules/order/order.entity';
import { OrderModule } from './modules/order/order.module';
import { OrderItem } from './modules/order/order-item.entity';
import { UploadModule } from './modules/upload/upload.module';
import { DATABASE_URL } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: DATABASE_URL,
      entities: [
        User,
        Craftsman,
        Category,
        Product,
        Offer,
        Comment,
        ShoppingCart,
        Order,
        OrderItem,
      ],
      synchronize: true,
    }), // Database configuration
    UserModule,
    CraftsmanModule,
    CategoryModule,
    ProductModule,
    OfferModule,
    CommentModule,
    ShoppingCartModule,
    OrderModule,
    UploadModule,
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
    // {
    //   provide: APP_GUARD,
    //   useClass: CraftsmanExpirationGuard,
    // },
  ],
  controllers: [AppController], // Import the AppController
})
export class AppModule {}
