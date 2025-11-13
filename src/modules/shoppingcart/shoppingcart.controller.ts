import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './shoppingcart.service';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateShoppingcartDto } from './dto/create-shoppingcart.dto';
import type { AuthUser } from 'src/auth/types/auth-user';
import { UpdateShoppingcartDto } from './dto/update-shoppingcart.dto';

@Controller('shoppingcarts')
@UseGuards(PermissionsGuard)
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  // GET /shoppingcarts → retrieve current user's cart items
  @Get()
  async getCartItems(@CurrentUser() user: AuthUser) {
    return this.shoppingCartService.getMyCart(user.id);
  }

  // POST /shoppingcarts → add a product to the current user's cart
  @Post()
  @RequirePermissions(Permission.MANAGE_SHOPPING_CART)
  async addToCart(
    @CurrentUser() user: AuthUser,
    @Body() cartData: CreateShoppingcartDto,
  ) {
    return this.shoppingCartService.addToCart(cartData, user.id);
  }

  // PATCH /shoppingcarts/:productId → update quantity of a product in the cart
  @Patch(':productId')
  @RequirePermissions(Permission.MANAGE_SHOPPING_CART)
  async updateCartItem(
    @Param('productId') productId: string,
    @CurrentUser() user: AuthUser,
    @Body() cartData: UpdateShoppingcartDto,
  ) {
    return this.shoppingCartService.updateQuantity(
      productId,
      cartData,
      user.id,
    );
  }

  // DELETE /shoppingcarts → clear the current user's cart
  @Delete()
  @RequirePermissions(Permission.MANAGE_SHOPPING_CART)
  async clearCart(@CurrentUser() user: AuthUser) {
    return this.shoppingCartService.clearCart(user.id);
  }

  // GET /shoppingcarts/craftsman-grouped → retrieve cart items grouped by craftsman
  @Get('craftsman-grouped')
  @RequirePermissions(Permission.MANAGE_SHOPPING_CART)
  async getCraftsmanGroupedCart(@CurrentUser() user: AuthUser) {
    return this.shoppingCartService.getCartGroupedByCraftsman(user.id);
  }
}
