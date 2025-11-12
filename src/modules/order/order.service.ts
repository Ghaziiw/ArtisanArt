import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    // Group products by craftsman
    const craftsmanGroups = cartItems.reduce(
      (groups, item) => {
        const craftsmanId = item.product.craftsmanId;
        if (!groups[craftsmanId]) groups[craftsmanId] = [];
        groups[craftsmanId].push(item);
        return groups;
      },
      {} as Record<string, ShoppingCart[]>,
    );

    const orders: Order[] = [];

    // Create an order for each craftsman group
    for (const craftsmanId in craftsmanGroups) {
      const items = craftsmanGroups[craftsmanId];
      const deliveryPrice: number = Number(
        items[0].product.craftsman.deliveryPrice,
      );

      // Verify stock availability
      for (const item of items) {
        const product = item.product;

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for product ${product.name}`,
          );
        }
      }

      // Deduct stock quantities
      for (const item of items) {
        const product = item.product;

        product.stock -= item.quantity;
        await this.cartRepository.manager.save(product);
      }

      const order = this.orderRepository.create({
        userId,
        status: OrderStatus.PENDING,
        ...placeOrderDto,
        deliveryPrice,
        items: items.map((item) =>
          this.orderItemRepository.create({
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: item.product.price,
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
