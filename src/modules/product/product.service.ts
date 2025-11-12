import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../category/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * Service responsible for managing product records using a TypeORM repository.
 * Provides methods to create, retrieve, update, and delete products,
 * ensuring proper validation and authorization.
 * @remarks
 * - All methods return Promises and may reject with database or repository errors.
 * - Validation errors throw BadRequestException or ForbiddenException as appropriate.
 *
 * Constructor:
 * @param productRepository - Injected TypeORM repository for ProductEntity used for all persistence operations.
 * @param categoryRepository - Injected TypeORM repository for CategoryEntity used for validating categories.
 *
 * Methods:
 * - findAll(): Retrieve all products with their categories.
 * - findOne(id: string): Retrieve a product by its identifier with its category and artisan.
 * - createProduct(productData: CreateProductDto, artisanId: string): Create a new product.
 * - update(id: string, updateProductDto: UpdateProductDto, artisanId: string): Update an existing product.
 * - deleteProduct(id: string, artisanId: string): Delete a product by its identifier.
 *
 * Error handling:
 * - All methods return Promises and may reject with database or repository errors
 *   (e.g. connection issues, constraint violations). Callers should handle rejections
 *   accordingly.
 * - createProduct and update throw BadRequestException for validation errors.
 * - update and deleteProduct throw ForbiddenException if the user lacks permission.
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, // Repository TypeORM pour Product
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>, // Repository TypeORM pour Category
  ) {}

  // Retrieve all products with their categories
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  // Retrieve a product by ID with its category and artisan
  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category', 'artisan'],
    });
  }

  // Create a new product with the associated artisan
  async createProduct(
    productData: CreateProductDto,
    craftsmanId: string,
  ): Promise<Product> {
    const categoryId = await this.categoryRepository.findOneBy({
      id: productData.categoryId,
    });

    // Verify category exists
    if (!categoryId) {
      throw new BadRequestException('Category not found');
    }

    const product = this.productRepository.create({
      ...productData,
      craftsmanId,
    });

    return this.productRepository.save(product);
  }

  // Update an existing product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    craftsmanId: string,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Verify product exists
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if user is the owner or admin
    if (product.craftsmanId !== craftsmanId) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    Object.assign(product, updateProductDto);

    product.updatedAt = new Date();

    return await this.productRepository.save(product);
  }

  // Delete a product
  async deleteProduct(id: string, craftsmanId: string) {
    const product = await this.findOne(id);

    // Verify product exists
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if user is the owner or admin
    if (product.craftsmanId !== craftsmanId) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    await this.productRepository.delete(id);

    return { message: 'Product deleted successfully' };
  }
}
