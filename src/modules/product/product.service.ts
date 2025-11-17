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
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductWithStats } from './dto/viw-product-stats.dto';
import { UploadService } from '../upload/upload.service';

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
    private readonly uploadService: UploadService, // Service to handle file uploads
  ) {}

  // Helper method to remove invalid offers from a product
  public removeInvalidOffer(product: Product): Product {
    if (!product.offer) return product;

    const now = new Date();
    const { startDate, endDate } = product.offer;

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const isValid = start <= now && (!end || end >= now);

    if (!isValid) {
      product.offer = undefined; // Remove invalid offer
    }

    return product;
  }

  // Retrieve all products with their categories
  async findAll(
    page: number,
    limit: number,
    filters: ProductFilterDto,
  ): Promise<Pagination<ProductWithStats, IPaginationMeta>> {
    const skip = (page - 1) * limit;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.craftsman', 'craftsman')
      .leftJoinAndSelect('product.offer', 'offer')
      .leftJoin('product.comments', 'comments')
      .addSelect('AVG(comments.mark)', 'avgRating')
      .addSelect('COUNT(comments.id)', 'totalComments')
      .groupBy('product.id')
      .addGroupBy('category.id')
      .addGroupBy('craftsman.userId')
      .addGroupBy('offer.productId');

    // --- Filter by craftsman name ---
    if (filters.craftsmanName) {
      qb.andWhere('craftsman.name ILIKE :craftsmanName', {
        craftsmanName: `%${filters.craftsmanName}%`,
      });
    }

    // --- Sort by price ---
    if (filters.sortByPrice) {
      qb.orderBy(
        'product.price',
        filters.sortByPrice.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      qb.orderBy('product.createdAt', 'DESC');
    }

    // --- Filter by category ID ---
    if (filters.categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    // --- Filter by name ---
    if (filters.name) {
      qb.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
    }

    // --- Filter by minPrice ---
    if (filters.minPrice) {
      qb.andWhere('product.price >= :minPrice', {
        minPrice: parseFloat(filters.minPrice),
      });
    }

    // --- Filter by maxPrice ---
    if (filters.maxPrice) {
      qb.andWhere('product.price <= :maxPrice', {
        maxPrice: parseFloat(filters.maxPrice),
      });
    }

    qb.skip(skip).take(limit);

    const totalItems = await qb.getCount();
    const { raw, entities } = await qb.getRawAndEntities();

    // Explicitly type raw as an array of objects with avgRating and totalComments
    const typedRaw = raw as Array<{
      avgRating: number | null;
      totalComments: number | null;
    }>;

    // Map entities to include avgRating and totalComments
    const mapped: ProductWithStats[] = entities.map((prod, i) => ({
      ...this.removeInvalidOffer(prod),
      avgRating: Number(typedRaw[i]?.avgRating ?? 0),
      totalComments: Number(typedRaw[i]?.totalComments ?? 0),
    }));

    return {
      items: mapped,
      meta: {
        totalItems,
        itemCount: mapped.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  // Retrieve a product by ID with its category and artisan
  async findOne(id: string): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'craftsman', 'offer', 'comments', 'category'],
    });

    return product ? this.removeInvalidOffer(product) : null;
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

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.craftsmanId !== craftsmanId) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    // Delete all product images before deleting the product
    if (product.images && product.images.length > 0) {
      await this.uploadService.deleteMultipleFiles(product.images);
    }

    await this.productRepository.delete(id);

    return { message: 'Product deleted successfully' };
  }

  // Update product images
  async updateProductImages(
    id: string,
    craftsmanId: string,
    newImageUrls: string[],
    keepExisting: boolean = false,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.craftsmanId !== craftsmanId) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    const oldImages = product.images || [];
    let finalImages: string[] = [];
    let imagesToDelete: string[] = [];

    if (keepExisting) {
      // Keep all existing images and add new ones
      finalImages = [...oldImages, ...newImageUrls];

      // Validate total image count (max 5)
      if (finalImages.length > 5) {
        // Clean up newly uploaded files before throwing error
        await this.uploadService.deleteMultipleFiles(newImageUrls);
        throw new BadRequestException(
          `Cannot add ${newImageUrls.length} images. Product already has ${oldImages.length} images. Maximum 5 images allowed per product.`,
        );
      }
    } else {
      // Replace all images
      finalImages = newImageUrls;
      imagesToDelete = oldImages;
    }

    try {
      // Update product in database
      product.images = finalImages;
      product.updatedAt = new Date();
      const updatedProduct = await this.productRepository.save(product);

      // Only delete old images after successful database update
      if (imagesToDelete.length > 0) {
        await this.uploadService.deleteMultipleFiles(imagesToDelete);
      }

      return updatedProduct;
    } catch (error) {
      // Rollback: delete new images if database update fails
      if (newImageUrls.length > 0) {
        await this.uploadService.deleteMultipleFiles(newImageUrls);
      }
      throw error;
    }
  }
}
