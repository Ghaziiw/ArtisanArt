import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Repository, DataSource } from 'typeorm';
import { ShoppingCart } from '../shoppingcart/shoppingcart.entity';
import { OrderStatus } from './enums/order-status.enum';
import { PlaceOrderDto } from './dto/create-order.dto';

/**
 * OrderService handles operations related to orders,
 * including placing orders, retrieving orders,
 * updating order statuses, and cancelling orders.
 *
 * Constructor:
 * @param orderRepository - Injected TypeORM repository for Order entity.
 * @param orderItemRepository - Injected TypeORM repository for OrderItem entity.
 * @param cartRepository - Injected TypeORM repository for ShoppingCart entity.
 * @param dataSource - TypeORM DataSource for transaction management.
 *
 * Methods:
 * - placeOrderForCraftsman(userId: string, craftsmanId: string, placeOrderDto: PlaceOrderDto): Places an order for a specific craftsman.
 * - placeAllOrders(userId: string, placeOrderDto: PlaceOrderDto): Places orders for all craftsmen in the user's cart.
 * - getUserOrders(userId: string): Retrieves all orders for a user.
 * - getCraftsmanOrders(craftsmanId: string): Retrieves all orders for a craftsman.
 * - getOrderById(orderId: string, userId: string): Retrieves a specific order by ID.
 * - cancelOrder(orderId: string, userId: string): Cancels an order.
 * - updateOrderStatus(orderId: string, craftsmanId: string, newStatus: OrderStatus): Updates the status of an order.
 *
 * Error Handling:
 * - Throws NotFoundException if the order or cart items do not exist.
 * - Throws BadRequestException for invalid operations such as insufficient stock or invalid status transitions.
 */
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ShoppingCart)
    private readonly cartRepository: Repository<ShoppingCart>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Place an order for a specific craftsman based on the user's shopping cart
   */
  async placeOrderForCraftsman(
    userId: string,
    craftsmanId: string,
    placeOrderDto: PlaceOrderDto,
  ): Promise<Order | null> {
    return await this.dataSource.transaction(async (manager) => {
      // Get cart items for this specific craftsman
      const cartItems = await manager.find(ShoppingCart, {
        where: { userId },
        relations: ['product', 'product.craftsman'],
      });

      // Filter items from the specific craftsman
      const craftsmanItems = cartItems.filter(
        (item) => item.product.craftsmanId === craftsmanId,
      );

      if (!craftsmanItems.length) {
        throw new NotFoundException(
          `No items found in cart for craftsman ${craftsmanId}`,
        );
      }

      // Validate stock availability
      this.validateStock(craftsmanItems);

      const deliveryPrice = Number(
        craftsmanItems[0].product.craftsman.deliveryPrice,
      );

      // Deduct stock quantities
      for (const item of craftsmanItems) {
        item.product.stock -= item.quantity;
        await manager.save(item.product);
      }

      // Create order
      const order = this.orderRepository.create({
        userId,
        status: OrderStatus.PENDING,
        cin: placeOrderDto.cin,
        location: placeOrderDto.location,
        state: placeOrderDto.state,
        phone: placeOrderDto.phone,
        deliveryPrice,
      });

      // Save order first to get the orderId
      const savedOrder = await manager.save(Order, order);

      // Create order items
      const orderItems = craftsmanItems.map((item) =>
        this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtOrder: item.product.price,
        }),
      );

      // Save order items
      await manager.save(OrderItem, orderItems);

      // Remove ordered items from cart
      await manager.remove(ShoppingCart, craftsmanItems);

      // Fetch complete order with items
      const completeOrder = await manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.product', 'items.product.craftsman'],
      });

      return completeOrder;
    });
  }

  /**
   * Place orders for the user based on their shopping cart
   * Creates separate orders for products from different craftsmen
   */
  async placeAllOrders(
    userId: string,
    placeOrderDto: PlaceOrderDto,
  ): Promise<Order[]> {
    // Retrieve cart items for the user with craftsman info
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['product', 'product.craftsman'],
    });

    if (!cartItems.length) {
      throw new NotFoundException('Shopping cart is empty');
    }

    // Group products by craftsman
    const craftsmanGroups = this.groupByCraftsman(cartItems);

    const orders: Order[] = [];

    // Create an order for each craftsman group
    for (const craftsmanId of Object.keys(craftsmanGroups)) {
      const order = await this.placeOrderForCraftsman(
        userId,
        craftsmanId,
        placeOrderDto,
      );
      if (order) {
        orders.push(order);
      }
    }

    return orders;
  }

  /**
   * Group cart items by craftsman ID
   */
  private groupByCraftsman(
    cartItems: ShoppingCart[],
  ): Record<string, ShoppingCart[]> {
    return cartItems.reduce(
      (groups, item) => {
        const craftsmanId = item.product.craftsmanId;
        if (!groups[craftsmanId]) {
          groups[craftsmanId] = [];
        }
        groups[craftsmanId].push(item);
        return groups;
      },
      {} as Record<string, ShoppingCart[]>,
    );
  }

  /**
   * Validate stock availability for all cart items
   */
  private validateStock(cartItems: ShoppingCart[]) {
    const outOfStockProducts: string[] = [];

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        outOfStockProducts.push(
          `${item.product.name} (available: ${item.product.stock}, requested: ${item.quantity})`,
        );
      }
    }

    if (outOfStockProducts.length > 0) {
      throw new BadRequestException(
        `Not enough stock for the following products: ${outOfStockProducts.join(', ')}`,
      );
    }
  }

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product', 'items.product.craftsman'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCraftsmanOrders(craftsmanId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { items: { product: { craftsmanId } } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product', 'items.product.craftsman'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Cancel an order (only if status is PENDING)
   */
  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    return await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId, userId },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Only pending orders can be cancelled
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Only pending orders can be cancelled');
      }

      // Restore stock quantities
      for (const item of order.items) {
        item.product.stock += item.quantity;
        await manager.save(item.product);
      }

      // Update order status
      order.status = OrderStatus.CANCELLED;
      return await manager.save(Order, order);
    });
  }

  /**
   * Validate if the status change is allowed
   */
  private validateStatusChange(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ) {
    // If the order is shipped, it cannot be reverted to pending or confirmed
    if (
      currentStatus === OrderStatus.SHIPPED &&
      [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(newStatus)
    ) {
      throw new BadRequestException(
        'Cannot revert a shipped order to pending or confirmed',
      );
    }

    // If the order is delivered, it cannot be reverted to any previous status
    if (
      currentStatus === OrderStatus.DELIVERED &&
      [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.SHIPPED,
      ].includes(newStatus)
    ) {
      throw new BadRequestException('Delivered orders cannot be reverted');
    }

    // If the order is confirmed, it cannot be reverted to pending
    if (
      currentStatus === OrderStatus.CONFIRMED &&
      newStatus === OrderStatus.PENDING
    ) {
      throw new BadRequestException(
        'Cannot revert a confirmed order to pending',
      );
    }

    // Cancelled orders cannot be updated to any other status
    if (
      currentStatus === OrderStatus.CANCELLED &&
      newStatus !== OrderStatus.CANCELLED
    ) {
      throw new BadRequestException('Cancelled orders cannot be updated');
    }
  }

  /**
   * Update order status by craftsman
   */
  async updateOrderStatus(
    orderId: string,
    craftsmanId: string,
    newStatus: OrderStatus,
  ): Promise<Order> {
    return await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId, items: { product: { craftsmanId } } },
        relations: ['items', 'items.product'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const currentStatus = order.status;

      // Verify valid status transition
      this.validateStatusChange(currentStatus, newStatus);

      // If cancelling, restore stock
      if (
        newStatus === OrderStatus.CANCELLED &&
        currentStatus !== OrderStatus.CANCELLED
      ) {
        for (const item of order.items) {
          item.product.stock += item.quantity;
          await manager.save(item.product);
        }
      }

      order.status = newStatus;
      return await manager.save(order);
    });
  }
}
