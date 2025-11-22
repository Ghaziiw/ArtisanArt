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
import { CraftsmanCartGroup } from './dto/craftsman-cart-group.dto';
import { Craftsman } from '../craftsman/craftsman.entity';
import { ProductService } from '../product/product.service';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

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
 * - getCartGroupedByCraftsman(userId: string): Retrieves cart items grouped by craftsman with totals.
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
    private readonly productService: ProductService,
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
      await this.shoppingCartRepository.save(existingCartItem);
    } else {
      // Create new cart item
      const cartItem = this.shoppingCartRepository.create({
        userId,
        productId: cartData.productId,
        quantity,
      });

      await this.shoppingCartRepository.save(cartItem);
    }

    const cartItemWithRelations = await this.shoppingCartRepository.findOne({
      where: { userId, productId: cartData.productId },
      relations: ['product', 'product.craftsman', 'product.offer'],
    });

    if (!cartItemWithRelations) {
      return null;
    }

    // Remove invalid offer from product before returning
    if (cartItemWithRelations.product) {
      this.productService.removeInvalidOffer(cartItemWithRelations.product);
    }

    return cartItemWithRelations;
  }

  // Retrieve the current user's cart items
  async getMyCart(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Pagination<ShoppingCart, IPaginationMeta>> {
    const skip = (page - 1) * limit;

    const [cartItems, totalItems] =
      await this.shoppingCartRepository.findAndCount({
        where: { userId },
        relations: ['product', 'product.craftsman', 'product.offer'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

    // Remove invalid offers from products
    for (const item of cartItems) {
      if (item.product) {
        this.productService.removeInvalidOffer(item.product);
      }
    }

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: cartItems,
      meta: {
        totalItems,
        itemCount: cartItems.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
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

  // Get cart items grouped by craftsman with totals
  async getCartGroupedByCraftsman(userId: string): Promise<{
    craftsmanGroups: CraftsmanCartGroup[];
    grandTotal: number;
    totalItems: number;
  }> {
    const cartItems = await this.shoppingCartRepository.find({
      where: { userId },
      relations: ['product', 'product.offer'],
      order: { createdAt: 'DESC' },
    });

    // Remove invalid offers from products
    for (const item of cartItems) {
      if (item.product) {
        this.productService.removeInvalidOffer(item.product);
      }
    }

    // If cart is empty
    if (cartItems.length === 0) {
      return {
        craftsmanGroups: [],
        grandTotal: 0,
        totalItems: 0,
      };
    }

    // Group items by craftsman
    const groupedByCraftsman = new Map<string, ShoppingCart[]>();

    // Populate the map
    for (const item of cartItems) {
      const craftsmanId = item.product.craftsmanId;
      if (!groupedByCraftsman.has(craftsmanId)) {
        groupedByCraftsman.set(craftsmanId, []);
      }
      groupedByCraftsman.get(craftsmanId)!.push(item);
    }

    // Create craftsman groups with calculations
    const craftsmanGroups: CraftsmanCartGroup[] = [];
    let grandTotal = 0;
    let totalItems = 0;

    // Iterate over each craftsman group to calculate totals and gather details
    for (const [craftsmanId, items] of groupedByCraftsman.entries()) {
      // Get craftsman details with delivery price
      const craftsman = await this.craftsmanRepository.findOne({
        where: { userId: craftsmanId },
        relations: ['user'],
      });

      if (!craftsman) continue; // Skip if craftsman not found

      // Calculate subtotal for this artisan
      const subtotal = items.reduce((sum, item) => {
        const pourcentage = item.product.offer
          ? (item.product.offer.percentage || 0) / 100
          : 0;
        const discountedPrice = Number(item.product.price) * (1 - pourcentage);
        return sum + discountedPrice * item.quantity;
      }, 0);

      const deliveryPrice = Number(craftsman.deliveryPrice);
      const total = subtotal + deliveryPrice;

      craftsmanGroups.push({
        craftsman: {
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
      craftsmanGroups,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      totalItems,
    };
  }
}
