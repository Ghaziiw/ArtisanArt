import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
  findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.categoryService.findAll(page, limit);
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
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  // PATCH /categories/:id → update an existing category
  @Patch(':id')
  @RequirePermissions(Permission.CATEGORIES_UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  // DELETE /categories/:id → delete a category
  @Delete(':id')
  @RequirePermissions(Permission.CATEGORIES_DELETE)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
