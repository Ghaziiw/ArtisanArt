import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingCart } from './shoppingcart.entity';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { CreateShoppingcartDto } from './dto/create-shoppingcart.dto';
import { UpdateShoppingcartDto } from './dto/update-shoppingcart.dto';

/**
 * ShoppingCartService handles operations related to the shopping cart,
 * including adding products, retrieving cart items, updating quantities,
 * and clearing the cart.
 *
 * Constructor:
 * @param shoppingCartRepository - Injected TypeORM repository for ShoppingCart entity.
 * @param productRepository - Injected TypeORM repository for Product entity.
 *
 * Methods:
 * - addToCart(cartData: CreateShoppingcartDto, userId: string): Adds a product to the user's cart.
 * - getMyCart(userId: string): Retrieves the current user's cart items.
 * - updateQuantity(productId: string, updateData: UpdateShoppingcartDto, userId: string): Updates the quantity of a product in the cart.
 * - clearCart(userId: string): Clears all items from the user's cart.
 *
 * Error Handling:
 * - Throws NotFoundException if the product or cart item does not exist.
 * - Throws BadRequestException for insufficient stock or invalid operations.
 */
@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Add a product to the user's cart
  async addToCart(
    cartData: CreateShoppingcartDto,
    userId: string,
  ): Promise<ShoppingCart | null> {
    const product = await this.productRepository.findOne({
      where: { id: cartData.productId },
    });

    // Verify product exists
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const quantity = cartData.quantity || 1;

    // Check if enough stock
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    // Check if product already in cart
    const existingCartItem = await this.shoppingCartRepository.findOne({
      where: {
        userId,
        productId: cartData.productId,
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Cannot add ${quantity} more. Maximum available: ${product.stock - existingCartItem.quantity}`,
        );
      }

      existingCartItem.quantity = newQuantity;
      return this.shoppingCartRepository.save(existingCartItem);
    }

    // Create new cart item
    const cartItem = this.shoppingCartRepository.create({
      userId,
      productId: cartData.productId,
      quantity,
    });

    await this.shoppingCartRepository.save(cartItem);

    return this.shoppingCartRepository.findOne({
      where: { userId, productId: cartData.productId },
      relations: ['user', 'product'],
    });
  }

  // Retrieve the current user's cart items
  async getMyCart(userId: string): Promise<ShoppingCart[]> {
    return this.shoppingCartRepository.find({
      where: { userId },
      relations: ['product', 'product.category'],
      order: { createdAt: 'DESC' },
    });
  }

  // Update the quantity of a product in the cart
  async updateQuantity(
    productId: string,
    updateData: UpdateShoppingcartDto,
    userId: string,
  ): Promise<ShoppingCart | { message: string }> {
    const cartItem = await this.shoppingCartRepository.findOne({
      where: { productId, userId },
      relations: ['product'],
    });

    // Verify cart item exists
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // If quantity is set to 0, remove the item from the cart
    if (updateData.quantity === 0) {
      await this.shoppingCartRepository.delete({ productId, userId });
      return { message: 'Cart item removed' };
    }

    // Check stock
    if (cartItem.product.stock < updateData.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${cartItem.product.stock}`,
      );
    }

    cartItem.quantity = updateData.quantity;

    return this.shoppingCartRepository.save(cartItem);
  }

  // Clear the user's cart
  async clearCart(userId: string): Promise<{ message: string }> {
    await this.shoppingCartRepository.delete({ userId });
    return { message: 'Cart cleared successfully' };
  }
}
