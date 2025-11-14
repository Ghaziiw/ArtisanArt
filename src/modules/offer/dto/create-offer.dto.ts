import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(0, { message: 'Percentage must be at least 0' })
  @Max(100, { message: 'Percentage cannot exceed 100' })
  percentage: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
