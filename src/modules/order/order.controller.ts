import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { OrderService } from './order.service';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { PlaceOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';

@Controller('orders')
@UseGuards(PermissionsGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST /orders/checkout → place an order based on the current user's cart
  @Post('checkout')
  @RequirePermissions(Permission.ORDERS_CREATE)
  checkout(
    @CurrentUser() user: AuthUser,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    return this.orderService.placeAllOrders(user.id, placeOrderDto);
  }

  // POST /orders/checkout/:craftsmanId → place an order for a specific craftsman
  @Post('checkout/:craftsmanId')
  @RequirePermissions(Permission.ORDERS_CREATE)
  placeOrderForCraftsman(
    @CurrentUser() user: AuthUser,
    @Param('craftsmanId') craftsmanId: string,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    return this.orderService.placeOrderForCraftsman(
      user.id,
      craftsmanId,
      placeOrderDto,
    );
  }

  // GET /orders → retrieve all orders for the current user
  @Get()
  @RequirePermissions(Permission.ORDERS_VIEW)
  async getUserOrders(@CurrentUser() user: AuthUser) {
    return this.orderService.getUserOrders(user.id);
  }

  // GET /orders/cancel/:orderId → cancel an order by ID
  @Get('cancel/:orderId')
  @RequirePermissions(Permission.ORDERS_CANCEL)
  cancelOrder(
    @CurrentUser() user: AuthUser,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.orderService.cancelOrder(orderId, user.id);
  }

  // GET /orders/craftsman → retrieve all orders for the current craftsman
  @Get('craftsman')
  @RequirePermissions(Permission.CRAFTSMAN_ORDERS_VIEW)
  getCraftsmanOrders(@CurrentUser() craftsman: AuthUser) {
    return this.orderService.getCraftsmanOrders(craftsman.id);
  }

  // GET /orders/:orderId → retrieve order details by ID
  @Get(':orderId')
  @RequirePermissions(Permission.ORDERS_VIEW)
  getOrderDetails(
    @CurrentUser() user: AuthUser,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.orderService.getOrderById(orderId, user.id);
  }

  // PATCH /orders/:orderId/status → update order status by craftsman
  @Patch(':orderId/status')
  @RequirePermissions(Permission.ORDERS_UPDATE_STATUS)
  async updateOrderStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body('status') status: OrderStatus,
    @CurrentUser() user: AuthUser,
  ) {
    return this.orderService.updateOrderStatus(orderId, user.id, status);
  }
}
