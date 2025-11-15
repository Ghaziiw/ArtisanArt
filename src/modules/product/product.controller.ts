import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  ParseUUIDPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { ProductService } from './product.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CraftsmanExpirationGuard } from 'src/auth/guards/craftsman-expiration.guard';

@Controller('products')
@UseGuards(PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET /products → retrieve all products
  @Get()
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  // GET /products/:id → retrieve a product by ID
  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  // POST /products → create a new product
  @Post()
  @RequirePermissions(Permission.PRODUCTS_CREATE)
  @UseGuards(CraftsmanExpirationGuard)
  async create(
    @CurrentUser() user: AuthUser,
    @Body() productData: CreateProductDto,
  ) {
    return await this.productService.createProduct(productData, user.id);
  }

  // PATCH /products/:id → update an existing product
  @Patch(':id')
  @RequirePermissions(Permission.PRODUCTS_UPDATE)
  @UseGuards(CraftsmanExpirationGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.productService.update(id, updateProductDto, user.id);
  }

  // DELETE /products/:id → delete a product
  @Delete(':id')
  @RequirePermissions(Permission.PRODUCTS_DELETE)
  @UseGuards(CraftsmanExpirationGuard)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.productService.deleteProduct(id, user.id);
  }
}
