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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, // Repository TypeORM pour Product
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>, // Repository TypeORM pour Category
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category', 'artisan'],
    });
  }

  async createProduct(
    productData: CreateProductDto,
    artisanId: string,
  ): Promise<Product> {
    const categoryId = await this.categoryRepository.findOneBy({
      id: productData.categoryId,
    });

    if (!categoryId) {
      throw new BadRequestException('Category not found');
    }

    const product = this.productRepository.create({
      ...productData,
      artisanId,
    });
    return this.productRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    artisanId: string,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if user is the owner or admin
    if (product.artisanId !== artisanId) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string, artisanId: string) {
    const product = await this.findOne(id);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Check if user is the owner or admin
    if (product.artisanId !== artisanId) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    await this.productRepository.delete(id);

    return { message: 'Product deleted successfully' };
  }
}
