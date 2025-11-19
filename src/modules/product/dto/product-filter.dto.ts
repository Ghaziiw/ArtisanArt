import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumberString,
  IsIn,
  Max,
  Min,
} from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByPrice?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  craftsmanName?: string;

  @IsOptional()
  @IsNumberString()
  @Max(5)
  @Min(0)
  minRating?: number;
}
