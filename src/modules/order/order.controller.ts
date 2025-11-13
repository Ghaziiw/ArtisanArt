import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { OrderService } from './order.service';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { PlaceOrderDto } from './dto/create-order.dto';

@Controller('orders')
@UseGuards(PermissionsGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST /orders/checkout → place an order based on the current user's cart
  @Post('checkout')
  @RequirePermissions(Permission.ORDERS_CREATE)
  async checkout(
    @CurrentUser() user: AuthUser,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    return this.orderService.placeOrder(user.id, placeOrderDto);
  }
}
