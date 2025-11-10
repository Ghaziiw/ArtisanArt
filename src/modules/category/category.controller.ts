import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CategoryService } from './category.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';

@Controller('categories')
@UseGuards(PermissionsGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {} // Inject CategoryService

  // GET /categories → retrieve all categories
  @Public()
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  // POST /categories → create a new category
  @Post()
  @RequirePermissions(Permission.CATEGORIES_CREATE)
  create(@Body() createCategoryDto: CategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  // GET /categories/:id → retrieve a category by ID
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  // PATCH /categories/:id → update an existing category
  @Patch(':id')
  @RequirePermissions(Permission.CATEGORIES_UPDATE)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  // DELETE /categories/:id → delete a category
  @Delete(':id')
  @RequirePermissions(Permission.CATEGORIES_DELETE)
  delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
