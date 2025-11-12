import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Repository } from 'typeorm';
import { ShoppingCart } from '../shoppingcart/shoppingcart.entity';
import { OrderStatus } from './enums/order-status.enum';
import { PlaceOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ShoppingCart)
    private readonly cartRepository: Repository<ShoppingCart>,
  ) {}

  // Place an order for the user based on their shopping cart
  async placeOrder(
    userId: string,
    placeOrderDto: PlaceOrderDto,
  ): Promise<Order[]> {
    // Retrieve cart items for the user
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });

    // If cart is empty, throw an exception
    if (!cartItems.length) {
      throw new NotFoundException('Shopping cart is empty');
    }

    // Group products by artisan
    const artisanGroups = cartItems.reduce(
      (groups, item) => {
        const artisanId = item.product.artisanId;
        if (!groups[artisanId]) groups[artisanId] = [];
        groups[artisanId].push(item);
        return groups;
      },
      {} as Record<string, ShoppingCart[]>,
    );

    const orders: Order[] = [];

    // Create an order for each artisan group
    for (const artisanId in artisanGroups) {
      const items = artisanGroups[artisanId];

      const order = this.orderRepository.create({
        userId,
        status: OrderStatus.PENDING,
        ...placeOrderDto,
        items: items.map((item) =>
          this.orderItemRepository.create({
            productId: item.productId,
            quantity: item.quantity,
          }),
        ),
      });

      // Save the order
      const savedOrder = await this.orderRepository.save(order);
      orders.push(savedOrder);

      // Remove products from the cart
      await this.cartRepository.remove(items);
    }

    return orders;
  }
}
