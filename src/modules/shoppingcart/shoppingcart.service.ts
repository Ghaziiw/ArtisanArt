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
import { ArtisanCartGroup } from './dto/artisan-cart-group.dto';
import { Craftsman } from '../craftsman/craftsman.entity';

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
 * - getCartGroupedByArtisan(userId: string): Retrieves cart items grouped by artisan with totals.
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
    @InjectRepository(Craftsman)
    private readonly craftsmanRepository: Repository<Craftsman>,
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

  // Get cart items grouped by artisan with totals
  async getCartGroupedByArtisan(userId: string): Promise<{
    artisanGroups: ArtisanCartGroup[];
    grandTotal: number;
    totalItems: number;
  }> {
    const cartItems = await this.shoppingCartRepository.find({
      where: { userId },
      relations: ['product', 'product.artisan', 'product.category'],
      order: { createdAt: 'DESC' },
    });

    // If cart is empty
    if (cartItems.length === 0) {
      return {
        artisanGroups: [],
        grandTotal: 0,
        totalItems: 0,
      };
    }

    // Group items by artisan
    const groupedByArtisan = new Map<string, ShoppingCart[]>();

    // Populate the map
    for (const item of cartItems) {
      const artisanId = item.product.artisanId;
      if (!groupedByArtisan.has(artisanId)) {
        groupedByArtisan.set(artisanId, []);
      }
      groupedByArtisan.get(artisanId)!.push(item);
    }

    // Create artisan groups with calculations
    const artisanGroups: ArtisanCartGroup[] = [];
    let grandTotal = 0;
    let totalItems = 0;

    // Iterate over each artisan group to calculate totals and gather details
    for (const [artisanId, items] of groupedByArtisan.entries()) {
      // Get craftsman details with delivery price
      const craftsman = await this.craftsmanRepository.findOne({
        where: { userId: artisanId },
        relations: ['user'],
      });

      if (!craftsman) continue; // Skip if craftsman not found

      // Calculate subtotal for this artisan
      const subtotal = items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
      }, 0);

      const deliveryPrice = Number(craftsman.deliveryPrice);
      const total = subtotal + deliveryPrice;

      artisanGroups.push({
        artisan: {
          id: craftsman.userId,
          businessName: craftsman.businessName,
          deliveryPrice: deliveryPrice,
          phone: craftsman.phone,
          workshopAddress: craftsman.workshopAddress,
        },
        items,
        subtotal: parseFloat(subtotal.toFixed(2)),
        deliveryPrice: parseFloat(deliveryPrice.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      });

      grandTotal += total;
      totalItems += items.reduce((sum, item) => sum + item.quantity, 0);
    }

    return {
      artisanGroups,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      totalItems,
    };
  }
}
