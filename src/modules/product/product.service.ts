import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../category/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductWithStats } from './dto/viw-product-stats.dto';
import { UploadService } from '../upload/upload.service';
import { CraftsmanService } from '../craftsman/craftsman.service';
import { CraftsmanWithStats } from '../craftsman/dto/view-craftsman-stats.dto';

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
    private readonly craftsmanService: CraftsmanService, // Service to get craftsman stats
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
      product.offer = null; // Remove invalid offer
    }

    return product;
  }

  private applyFilters(qb: SelectQueryBuilder<any>, filters: ProductFilterDto) {
    if (filters.craftsmanName) {
      qb.andWhere('craftsman.businessName ILIKE :craftsmanName', {
        craftsmanName: `%${filters.craftsmanName}%`,
      });
    }

    if (filters.categoriesId) {
      const categories = Array.isArray(filters.categoriesId)
        ? filters.categoriesId
        : [filters.categoriesId];

      qb.andWhere('category.id IN (:...categories)', { categories });
    }

    if (filters.name) {
      qb.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.minPrice) {
      qb.andWhere(
        '(product.price * (1 - COALESCE(offer.percentage, 0) / 100)) >= :minPrice',
        { minPrice: Number(filters.minPrice) },
      );
    }

    if (filters.maxPrice) {
      qb.andWhere(
        '(product.price * (1 - COALESCE(offer.percentage, 0) / 100)) <= :maxPrice',
        { maxPrice: Number(filters.maxPrice) },
      );
    }

    if (filters.minRating) {
      qb.having('COALESCE(AVG(comments.mark), 0) >= :minRating', {
        minRating: Number(filters.minRating),
      });
    }

    if (filters.freeShipping === 'true') {
      qb.andWhere('craftsman.deliveryPrice = 0');
    }

    if (filters.craftsmanId) {
      qb.andWhere('craftsman.userId = :craftsmanId', {
        craftsmanId: filters.craftsmanId,
      });
    }
  }

  // Retrieve all products with their categories
  async findAll(
    page: number,
    limit: number,
    filters: ProductFilterDto,
  ): Promise<Pagination<ProductWithStats, IPaginationMeta>> {
    const skip = (page - 1) * limit;

    // 1) Créer la query de base
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

    // 2) Appliquer les filtres
    this.applyFilters(qb, filters);

    // 3) Appliquer le tri
    if (filters.sortByPrice) {
      qb.orderBy(
        'product.price',
        filters.sortByPrice.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      qb.orderBy('product.createdAt', 'DESC');
    }

    // 4) CLONER la query pour compter AVANT la pagination
    // Important: le clone inclut tous les filtres (WHERE et HAVING)
    const countQb = qb.clone();
    const countResult = await countQb.getRawMany();
    const totalItems = countResult.length;

    // 5) Appliquer la pagination sur la query principale
    qb.skip(skip).take(limit);

    // 6) Récupérer les données paginées
    const { raw, entities } = await qb.getRawAndEntities();

    const typedRaw = raw as Array<{
      avgRating: number | null;
      totalComments: number | null;
    }>;

    // 7) Mapper les résultats
    const mapped: ProductWithStats[] = await Promise.all(
      entities.map(async (prod, i) => {
        let craftsmanStats: CraftsmanWithStats | null = null;
        if (prod.craftsman) {
          craftsmanStats = await this.craftsmanService.findOneByUserIdWithStats(
            prod.craftsman.userId,
          );
        }
        return {
          ...this.removeInvalidOffer(prod),
          avgRating: Number(typedRaw[i]?.avgRating ?? 0),
          totalComments: Number(typedRaw[i]?.totalComments ?? 0),
          craftsman: craftsmanStats!,
        };
      }),
    );

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
    files?: Express.Multer.File[],
  ): Promise<Product> {
    const categoryId = await this.categoryRepository.findOneBy({
      id: productData.categoryId,
    });

    // Verify category exists
    if (!categoryId) {
      throw new BadRequestException('Category not found');
    }

    this.productRepository.create({
      ...productData,
      craftsmanId,
    });

    // Generate image URLs
    const imageUrls =
      files?.map((file) =>
        this.uploadService.getFileUrl(file.filename, 'products'),
      ) || [];

    // Add images to product data
    const productWithImages = {
      ...productData,
      craftsmanId,
      images: imageUrls,
    };

    return this.productRepository.save(productWithImages);
  }

  // Update an existing product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    craftsmanId: string,
    files?: Express.Multer.File[],
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

    this.updateProductImages(
      id,
      craftsmanId,
      files
        ? files.map((file) =>
            this.uploadService.getFileUrl(file.filename, 'products'),
          )
        : [],
      true,
    ).catch(() => {
      // Ignore errors here, as they will be handled in the main update flow
    });

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
