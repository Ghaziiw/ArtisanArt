import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  MinLength,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Price must be at least 0' })
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Stock must be at least 0' })
  stock?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
