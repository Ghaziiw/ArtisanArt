import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumberString,
  IsIn,
  Max,
  Min,
  IsBooleanString,
} from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  categoriesId?: string[];

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

  @IsOptional()
  @IsBooleanString()
  freeShipping?: string;
}
