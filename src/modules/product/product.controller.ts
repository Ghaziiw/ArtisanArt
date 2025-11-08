import { Controller, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { ProductService } from './product.service';

@Controller('products')
@UseGuards(PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
