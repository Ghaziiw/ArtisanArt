import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryDto } from './dto/category.dto';

/**
 * Service for managing categories.
 *
 * This service provides methods to create, retrieve, update, and delete categories
 * using a TypeORM repository for persistence.
 *
 * @remarks
 * - All methods return Promises and may reject with database or repository errors.
 * - Validation errors throw BadRequestException or NotFoundException as appropriate.
 *
 * Constructor:
 * @param categoryRepository - Injected TypeORM repository for CategoryEntity used for all persistence operations.
 *
 * Methods:
 * - findAll(): Retrieve all categories.
 *   @returns Promise that resolves to an array of CategoryEntity objects.
 *
 * - createCategory(createCategoryDto: CategoryDto): Create a new category.
 *   @param createCategoryDto - DTO containing the details of the category to create.
 *   @returns Promise that resolves to the created CategoryEntity instance.
 *   @throws BadRequestException if category with the same name already exists.
 *
 * - findOne(id: string): Retrieve a category by its identifier.
 *   @param id - The identifier of the category to retrieve.
 *   @returns Promise that resolves to the matched CategoryEntity or throws NotFoundException if not found.
 *
 * - updateCategory(id: string, updateCategoryDto: CategoryDto): Update an existing category.
 *   @param id - The identifier of the category to update.
 *   @param updateCategoryDto - DTO containing the fields to update.
 *   @returns Promise that resolves to the updated CategoryEntity instance.
 *   @throws BadRequestException if category name conflicts with an existing category.
 *
 * - deleteCategory(id: string): Delete a category by its identifier.
 *   @param id - The identifier of the category to delete.
 *   @returns Promise that resolves when the category is deleted.
 *   @throws NotFoundException if category is not found.
 *
 * Error handling:
 * - All methods return Promises and may reject with database or repository errors
 *   (e.g. connection issues, constraint violations). Callers should handle rejections
 *   accordingly.
 * - createCategory and updateCategory throw BadRequestException for validation errors.
 * - findOne and deleteCategory throw NotFoundException if the category is not found.
 */
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>, // Repository TypeORM for CategoryEntity
  ) {}

  // Retrieve all categories ordered by name
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  // Create a new category
  async createCategory(
    createCategoryDto: CategoryDto,
  ): Promise<CategoryEntity> {
    // Check if category name already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  // Retrieve a category by ID
  async findOne(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  // Update an existing category
  async updateCategory(
    id: string,
    updateCategoryDto: CategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(id);

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new BadRequestException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
