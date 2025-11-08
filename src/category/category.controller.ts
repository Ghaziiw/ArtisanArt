import { Controller, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CategoryService } from './category.service';

@Controller('categories')
@UseGuards(PermissionsGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
}
