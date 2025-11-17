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
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
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
import { ProductFilterDto } from './dto/product-filter.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { multerConfig } from 'src/config/multer.config';
import { CleanupFilesInterceptor } from '../upload/interceptors/cleanup-files.interceptor';

@Controller('products')
@UseGuards(PermissionsGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  // GET /products → retrieve all products
  @Get()
  @Public()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() rawQuery: Record<string, any>,
  ) {
    const filters: ProductFilterDto = rawQuery;
    return this.productService.findAll(page, limit, filters);
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
  @UseInterceptors(
    FilesInterceptor('images', 5, multerConfig),
    CleanupFilesInterceptor,
  )
  async create(
    @CurrentUser() user: AuthUser,
    @Body() productData: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Validate files if provided
    if (files && files.length > 0) {
      this.uploadService.validateFiles(files);
    }

    // Generate image URLs
    const imageUrls =
      files?.map((file) =>
        this.uploadService.getFileUrl(file.filename, 'products'),
      ) || [];

    // Add images to product data
    const productWithImages = {
      ...productData,
      images: imageUrls,
    };

    return await this.productService.createProduct(productWithImages, user.id);
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

  // PATCH /products/:id/images → update product images
  @Patch(':id/images')
  @RequirePermissions(Permission.PRODUCTS_UPDATE)
  @UseGuards(CraftsmanExpirationGuard)
  @UseInterceptors(
    FilesInterceptor('images', 5, multerConfig),
    CleanupFilesInterceptor,
  )
  async updateImages(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('replaceAll') replaceAll?: string, // 'true' or 'false'
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    this.uploadService.validateFiles(files);

    const newImageUrls = files.map((file) =>
      this.uploadService.getFileUrl(file.filename, 'products'),
    );

    const shouldReplaceAll = replaceAll === 'true';

    return await this.productService.updateProductImages(
      id,
      user.id,
      newImageUrls,
      !shouldReplaceAll, // keepExisting
    );
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
