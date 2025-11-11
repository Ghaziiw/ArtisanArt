import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  MinLength,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0, { message: 'Price must be at least 0' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'Stock must be at least 0' })
  stock: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
